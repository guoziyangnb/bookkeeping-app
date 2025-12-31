<template>
  <div class="pie-chart-container">
    <svg class="pie-chart-svg" viewBox="0 0 200 200">
      <!-- 扇形切片 -->
      <g v-if="slices.length > 0">
        <path
          v-for="(slice, index) in slices"
          :key="index"
          :d="slice.path"
          :fill="slice.color"
          stroke="var(--bg-primary)"
          stroke-width="2"
          class="pie-slice"
          :class="{
            active: selectedIndex === index,
            hovered: hoveredIndex === index,
          }"
          @click="selectSlice(index)"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = -1"
        />
      </g>
      <!-- 中心圆（创建环形图效果） -->
      <circle cx="100" cy="100" r="60" fill="var(--bg-primary)" />
      <!-- 中心文字 -->
      <text x="100" y="95" text-anchor="middle" class="pie-chart-label">
        {{ centerText }}
      </text>
      <text x="100" y="120" text-anchor="middle" class="pie-chart-value">
        {{ centerValue }}
      </text>
    </svg>

    <!-- 图例 -->
    <div class="pie-chart-legend">
      <div
        v-for="(item, index) in legendItems"
        :key="index"
        class="legend-item"
      >
        <div class="legend-color" :style="{ background: item.color }"></div>
        <span class="legend-label">{{ item.category }}</span>
        <span class="legend-value">{{ item.percentage }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
});

// 状态管理
const selectedIndex = ref(-1);
const hoveredIndex = ref(-1);

// 分类颜色
const categoryColors = [
  "var(--accent-orange)",
  "var(--accent-blue)",
  "var(--accent-purple)",
  "var(--accent-green)",
  "var(--text-secondary)",
];

// 总金额
const totalAmount = computed(() => {
  return props.data.reduce((sum, item) => sum + item.amount, 0);
});

// 生成扇形切片
const slices = computed(() => {
  if (totalAmount.value === 0) return [];

  let currentAngle = -90; // 从顶部开始
  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  return props.data.map((item, index) => {
    const percentage = item.amount / totalAmount.value;
    const angle = percentage * 360;

    // 计算起始和结束角度（弧度）
    const startAngle = (currentAngle * Math.PI) / 180;
    const endAngle = ((currentAngle + angle) * Math.PI) / 180;

    // 计算起点和终点坐标
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    // 判断是否是大角度（超过180度）
    const largeArcFlag = angle > 180 ? 1 : 0;

    // SVG path 命令
    const path = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    currentAngle += angle;

    return {
      path,
      color: categoryColors[index % categoryColors.length],
      data: item,
      index,
    };
  });
});

// 中心文字
const centerText = computed(() => {
  if (selectedIndex.value !== -1) {
    return props.data[selectedIndex.value].category;
  }
  if (hoveredIndex.value !== -1) {
    return props.data[hoveredIndex.value].category;
  }
  return "总支出";
});

// 中心数值
const centerValue = computed(() => {
  const index =
    selectedIndex.value !== -1 ? selectedIndex.value : hoveredIndex.value;

  if (index !== -1) {
    const percentage = (
      (props.data[index].amount / totalAmount.value) *
      100
    ).toFixed(1);
    return `${percentage}%`;
  }

  return `¥${totalAmount.value.toFixed(2)}`;
});

// 图例数据
const legendItems = computed(() => {
  return props.data.map((item, index) => ({
    category: item.category,
    percentage: ((item.amount / totalAmount.value) * 100).toFixed(1),
    color: categoryColors[index % categoryColors.length],
  }));
});

// 选择切片
function selectSlice(index) {
  if (selectedIndex.value === index) {
    selectedIndex.value = -1; // 取消选择
  } else {
    selectedIndex.value = index;
  }
}
</script>

<style scoped>
.pie-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
}

.pie-chart-svg {
  width: 200px;
  height: 200px;
  display: block;
}

.pie-slice {
  transition: all 0.3s ease;
  cursor: pointer;
}

.pie-slice:hover {
  opacity: 0.8;
  transform: scale(1.02);
  transform-origin: 100px 100px;
}

.pie-slice.active {
  opacity: 0.9;
  transform: scale(1.05);
  transform-origin: 100px 100px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.pie-slice.hovered {
  opacity: 0.85;
}

.pie-chart-label {
  font-size: 12px;
  font-weight: 500;
  fill: var(--text-secondary);
}

.pie-chart-value {
  font-size: 18px;
  font-weight: 600;
  fill: var(--text-primary);
}

.pie-chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  font-size: 13px;
  color: var(--text-primary);
}

.legend-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 响应式 */
@media (max-width: 480px) {
  .pie-chart-svg {
    width: 180px;
    height: 180px;
  }

  .pie-chart-legend {
    gap: 12px;
  }

  .legend-item {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }
}
</style>
