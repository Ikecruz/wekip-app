import { BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { StatusBar, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";

const CustomBackdrop = ({ animatedIndex, style, close }: BottomSheetBackdropProps & {close: () => void}) => {
    // animated variables
    const containerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 1],
            Extrapolate.CLAMP
        ),
    }));

    // styles
    const containerStyle = useMemo(
        () => [
            style,
            {
                backgroundColor: "#323E48b3",
            },
            containerAnimatedStyle,
        ],
        [style, containerAnimatedStyle]
    );

    return <Animated.View style={containerStyle} onTouchEnd={close} />;
};


interface Props<Point> extends Omit<BottomSheetModalProps, 'snapPoints'> {
    snapPoints: Point[],
    children: React.ReactNode
}

export const BottomSlider = forwardRef<BottomSheetModal, Props<string>>(
    (props, ref) => {

        const { snapPoints, children,...otherProps } = props

        const innerRef = useRef<BottomSheetModal>(null)

        useImperativeHandle(ref, () => innerRef.current!)

        const points = useMemo(() => snapPoints, [])
        
        return <>
            <BottomSheetModal
                ref={innerRef}
                index={0}
                snapPoints={points}
                backdropComponent={({ animatedIndex, style, animatedPosition }) => 
                    <CustomBackdrop 
                        animatedPosition={animatedPosition} 
                        animatedIndex={animatedIndex} 
                        style={style} 
                        close={() => innerRef.current!.close()}
                    />
                }
                {...otherProps}
            >
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
                <View style={styles.container}>
                    {children}
                </View>
            </BottomSheetModal>
        </>
    }
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})