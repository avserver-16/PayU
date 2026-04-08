import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from "react-native-svg";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PieSlice {
    label: string;
    value: number;
    color: string;
    colorEnd?: string;
}

export interface SemiCirclePieChartProps {
    data: PieSlice[];
    title?: string;
    subtitle?: string;
    /** Diameter of the full circle */
    size?: number;
    /** Thickness of the arc strokes */
    strokeWidth?: number;
    /** Gap between segments in degrees */
    gapDeg?: number;
    /** Background track color */
    trackColor?: string;
    /**
     * 0–100: controls WHERE the disc thumb sits on the arc.
     * 0 = left end, 100 = right end.
     */
    valueText?: number;
    /** Short label rendered inside the disc. Defaults to the numeric value. */
    discLabel?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEG_TO_RAD = Math.PI / 180;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    // angleDeg 0 → left tip of semicircle, 180 → right tip
    const rad = (angleDeg - 180) * DEG_TO_RAD;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function buildArcPath(
    cx: number,
    cy: number,
    r: number,
    startDeg: number,
    endDeg: number
): string {
    const start = polarToCartesian(cx, cy, r, startDeg);
    const end = polarToCartesian(cx, cy, r, endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ─── Component ────────────────────────────────────────────────────────────────

const SemiCirclePieChart: React.FC<SemiCirclePieChartProps> = ({
    data,
    title,
    subtitle,
    size = 300,
    strokeWidth = 22,
    gapDeg = 4,
    trackColor = "#1E1E2E",
    valueText = 0,
    discLabel,
}) => {
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - strokeWidth) / 2 - 4;

    const totalDeg = 180;
    const totalGapDeg = gapDeg * data.length;
    const availableDeg = totalDeg - totalGapDeg;
    const total = data.reduce((s, d) => s + d.value, 0);

    // ── Build segment descriptors ──────────────────────────────────────────────
    type Segment = {
        slice: PieSlice;
        startDeg: number;
        endDeg: number;
        gradId: string;
        arcPath: string;
        dashTotal: number;
    };

    const segments: Segment[] = [];
    let cursor = 0;

    data.forEach((slice, i) => {
        const sliceDeg = (slice.value / total) * availableDeg;
        const startDeg = cursor + gapDeg / 2;
        const endDeg = cursor + sliceDeg + gapDeg / 2;
        cursor += sliceDeg + gapDeg;

        const arcPath = buildArcPath(cx, cy, r, startDeg, endDeg);
        const arcAngleRad = (endDeg - startDeg) * DEG_TO_RAD;
        const dashTotal = arcAngleRad * r;

        segments.push({
            slice,
            startDeg,
            endDeg,
            gradId: `grad_${i}`,
            arcPath,
            dashTotal,
        });
    });

    // ── Disc position ──────────────────────────────────────────────────────────
    // valueText (0–100) maps linearly to 0–180° on the semicircle
    const clampedValue = Math.min(1000, Math.max(0, valueText));
    const discDeg = (clampedValue / 100) * 180;
    const discPos = polarToCartesian(cx, cy, r, discDeg);

    // Pick color from whichever segment the disc lands on
    const activeSegment =
        segments.find((s) => discDeg >= s.startDeg && discDeg <= s.endDeg) ??
        segments[segments.length - 1];
    const discColorStart = activeSegment?.slice.color ?? "#ffffff";
    const discColorEnd = activeSegment?.slice.colorEnd ?? discColorStart;

    // ── Sizing ─────────────────────────────────────────────────────────────────
    const DISC_R = strokeWidth * 0.9;   // outer disc radius
    const RING_R = DISC_R + 7;           // soft glow ring
    const INNER_R = strokeWidth * 0.55;  // dark inner hole

    // SVG height: half circle + enough room for the disc to not clip
    const svgHeight = size / 2 + RING_R + 4;

    // ── Animations ─────────────────────────────────────────────────────────────
    const anims = useRef(data.map(() => new Animated.Value(0))).current;
    const discAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const segAnims = anims.map((anim, i) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 900,
                delay: i * 150,
                useNativeDriver: false,
            })
        );

        // Segments draw first, then disc pops in
        Animated.sequence([
            Animated.stagger(150, segAnims),
            Animated.spring(discAnim, {
                toValue: 1,
                friction: 4,
                tension: 70,
                useNativeDriver: false,
            }),
        ]).start();
    }, []);

    const discGradId = "disc_grad";
    const discGlowId = "disc_glow";

    return (
        <View style={styles.wrapper}>
            <View style={{ width: size, height: svgHeight + 16 }}>
                <Svg
                    width={size}
                    height={svgHeight}
                    viewBox={`0 0 ${size} ${svgHeight}`}
                >
                    <Defs>
                        {/* Per-segment gradients */}
                        {segments.map((seg) =>
                            seg.slice.colorEnd ? (
                                <LinearGradient
                                    key={seg.gradId}
                                    id={seg.gradId}
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <Stop offset="0%" stopColor={seg.slice.color} />
                                    <Stop offset="100%" stopColor={seg.slice.colorEnd} />
                                </LinearGradient>
                            ) : null
                        )}

                        {/* Disc fill gradient */}
                        <LinearGradient id={discGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor={discColorStart} />
                            <Stop offset="100%" stopColor={discColorEnd} />
                        </LinearGradient>

                        {/* Disc glow (semi-transparent radial-ish via a wider circle) */}
                        <LinearGradient id={discGlowId} x1="0%" y1="0%" x2="0%" y2="100%">
                            <Stop offset="0%" stopColor={discColorStart} stopOpacity={0.35} />
                            <Stop offset="100%" stopColor={discColorEnd} stopOpacity={0} />
                        </LinearGradient>
                    </Defs>

                    {/* ── Background track ── */}
                    <Path
                        d={buildArcPath(cx, cy, r, gapDeg / 2, 180 - gapDeg / 2)}
                        fill="none"
                        stroke={trackColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                    />

                    {/* ── Arc segments ── */}
                    {segments.map((seg, i) => {
                        const strokeColor = seg.slice.colorEnd
                            ? `url(#${seg.gradId})`
                            : seg.slice.color;
                        return (
                            <AnimatedPath
                                key={i}
                                d={seg.arcPath}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={seg.dashTotal}
                                strokeDashoffset={anims[i].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [seg.dashTotal, 0],
                                })}
                            />
                        );
                    })}

                    {/* ── Disc thumb ── */}

                    {/* 1. Outer ambient glow
          <AnimatedCircle
            cx={discPos.x}
            cy={discPos.y}
            r={discAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, RING_R],
            })}
            fill={`url(#${discGlowId})`}
          />

          {/* 2. Outer border ring */}
                    {/* <AnimatedCircle
            cx={discPos.x}
            cy={discPos.y}
            r={discAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, DISC_R + 2],
            })}
            fill="none"
            stroke={discColorEnd}
            strokeWidth={1.5}
            opacity={0.5}
          /> */}

                    {/* 3. Main filled disc */}
                    <AnimatedCircle
                        cx={discPos.x}
                        cy={discPos.y}
                        r={discAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, DISC_R],
                        })}
                        fill={`url(#${discGradId})`}
                    />

                    {/* 4. Dark inner hole */}
                    <AnimatedCircle
                        cx={discPos.x}
                        cy={discPos.y}
                        r={discAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, INNER_R],
                        })}
                        fill="#0D0D1A"
                    />
                </Svg>

                {/* ── Disc label (RN Text for crisp rendering) ── */}
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.discLabelWrap,
                        {
                            left: discPos.x - DISC_R,
                            top: discPos.y - DISC_R,
                            width: DISC_R * 2,
                            height: DISC_R * 2,
                            borderRadius: DISC_R,
                            opacity: discAnim,
                            transform: [
                                {
                                    scale: discAnim.interpolate({
                                        inputRange: [0, 0.6, 1],
                                        outputRange: [0, 1.15, 1],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.discText,
                            {
                                color: discColorEnd,
                                fontSize: DISC_R * 0.58,
                            },
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {discLabel ?? `${clampedValue}`}
                    </Text>
                </Animated.View>

                {/* ── Bottom-center reading ── */}
                <View style={[styles.centerOverlay, { bottom: 48, width: size }]}>
                    <Text style={[styles.centerValue, { color: "#FAFAFA" }]}>
                        {clampedValue}
                    </Text>
                    <Text style={styles.centerSub}>{valueText < 600 ? "Good" : valueText < 800 ? "Excellent" : valueText < 1000 ? "Outstanding" : "Perfect"}</Text>
                </View>
            </View>

            {/* Title / Subtitle */}
            {(title || subtitle) && (
                <View style={styles.textBlock}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
            )}
        </View>
    );
};

export default SemiCirclePieChart;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        borderRadius: 28,
        padding: 24,
        paddingBottom: 20,
    },
    discLabelWrap: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    discText: {
        // fontWeight: "800",
        letterSpacing: -0.5,
    },
    centerOverlay: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    centerValue: {
        fontSize: 48,
        fontWeight: "600",
        // letterSpacing: -1,
    },
    centerSub: {
        fontSize: 12,
        color: "#6B6B8A",
        fontWeight: "500",
        letterSpacing: 0.5,
        marginTop: 2,
    },
    textBlock: {
        alignItems: "center",
        // marginTop: 12,
        top:-12
    },
    title: {
        color: "#F0EEFF",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
    subtitle: {
        color: "#6B6B8A",
        fontSize: 13,
        marginTop: 4,
    },
});