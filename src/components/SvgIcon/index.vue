<template>
    <!-- 展示外部图标 -->
     <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon" :class="className">
        <svg-icon :icon-name="iconName" />
    </div>
    <!-- 展示内部图标 -->
    <div class="svg-icon">
        <svg-icon :icon-name="iconName" :class="className" >
            <use :xlink:href="iconName" />
        </svg-icon>
    </div>
</template>
<script setup>
import { isExternal } from '@/utils/validate'
import { defineProps, computed } from 'vue'
defineProps({
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
const isExternal = computed(()=> isExternal(props.icon))

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