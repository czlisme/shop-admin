<template>
    <div class="Sakura">
        <canvas id="canvas_sakura" ref="canvas_sakura" :style="{zIndex: zIndex}"></canvas>
    </div>
</template>

<script>

</script>

<style scoped>
    #canvas_sakura{
        pointer-events: none;
        position: fixed;
        top:0;
        left:0;
    }
</style>
