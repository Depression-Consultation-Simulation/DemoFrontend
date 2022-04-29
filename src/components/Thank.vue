<template>
    <el-container>
        <el-main>
            <el-card
                    title="Tips"
                    tag="article"
                    style="min-width: 50rem;max-width: 50rem"
            >
                <el-header>评测结束，感谢您的参与！</el-header>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
    export default {
        name: "Thank"
    }
</script>

<style scoped>
    .el-header, .el-footer {
        background-color: #deebed;
        color: #333;
        text-align: center;
        line-height: 60px;
        font-size: larger;
        font-weight: bolder;
        border: thin #9abdf9;
        border-radius: 4px;
    }

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        height: 55rem;
        line-height: 38px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .card-body{
        text-align: left;
    }
    br{
        display:inline;
        line-height:11px;
    }
</style>