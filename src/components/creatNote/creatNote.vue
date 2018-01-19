<template>
    <!-- <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>markdown</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            Vue-SimpleMDE：Vue.js的Markdown Editor组件。
            访问地址：<a href="https://github.com/F-loat/vue-simplemde" target="_blank">Vue-SimpleMDE</a>
        </div>
        <markdown-editor preview-class="markdown-body" v-model="content" :highlight="highlight" :configs="configs" ref="markdownEditor"></markdown-editor>
        <div class="plugins-tips">
            <p>既然用了markdown语法了，那么就有一个很实际的问题了。要怎么在前台展示数据呢？</p>
            <br>
            <p>这个时候就需要解析markdown语法了。可以使用 <a href="https://github.com/miaolz123/vue-markdown" target="_blank">vue-markdown</a>：一个基于vue.js的markdown语法解析插件。（这里不作展开，有需要自行了解）</p>
        </div>
        <button @click="save">保存</button>
    </div> -->

    <div class="g-md-edit">
        <el-button type="text" @click="gohome"> <i class="el-icon-arrow-left"></i>返回首页</el-button>
        <div style="height:20px;"></div>
    	<markdown-editor preview-class="markdown-body" v-model="content" :highlight="highlight" :configs="configs" ref="markdownEditor">
    		
    	</markdown-editor>
        <el-button type="primary" @click="save">发布</el-button>
    	<!-- <button @click="save">提交</button> -->
    </div>
</template>

<script>
	import 'simplemde/dist/simplemde.min.css';
	import 'highlight.js/styles/atom-one-dark.css';
	import 'github-markdown-css';
    import { markdownEditor } from 'vue-simplemde';
    import hljs from 'highlight.js';

    window.hljs = hljs;
    export default {
        data: function(){
            return {
            	highlight:true,
                content:'',
                configs: {
                    autoDownloadFontAwesome:false,
                    // status: true,
                    // initialValue: 'Hello BBK',
                    // highlight: true,
                    renderingConfig: {
                        codeSyntaxHighlighting: true,
                        highlightingTheme: 'atom-one-light'
                    }
                }
            }
        },
        components: {
            markdownEditor
        },
        methods: {
        	save () {
        		console.log(this.content)
        	},
        	gohome () {
        		this.$router.push('home')
        	}
        }
    }
</script>
<style>
	.g-md-edit{
		padding: 20px;
	}
</style>