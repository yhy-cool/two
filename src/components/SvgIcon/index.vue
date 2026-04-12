<template>
    <!-- 展示外部图标 -->
     <div v-if="isExternalIcon" :style="styleExternalIcon" class="svg-external-icon" :class="className">
        <svg :class="className" />
    </div>
    <!-- 展示内部图标 -->
    <div v-else class="svg-icon">
        <svg :class="className" >
            <use :xlink:href="iconName" />
        </svg>
    </div>
</template>
<script setup>
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'

const props = defineProps({
    icon: {
        type: String,
        required: true,
        default: ''
    },
    //图标类名
    className: {
        type: String,
        default: ''
    }
})

// 判断是否外部图标
const isExternalIcon = computed(()=> isExternal(props.icon))

//外部图标样式
const styleExternalIcon = computed(()=> ({
    mask: `url(${props.icon}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`
}))

//项目内图标
const iconName = computed(()=> `#icon-${props.icon}`)


</script>

<style scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.svg-external-icon {
    background-color: currentColor;
    mask-size: cover!important;
    display: inline-block;
}
</style>