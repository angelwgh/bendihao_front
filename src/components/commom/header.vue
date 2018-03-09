<template>
	<div>
		<el-menu :default-active="activeIndex" 
				 class="el-menu-demo" 
				 mode="horizontal" 
				 @select="handleSelect"
				 :router="true">
		  <el-menu-item index="/index">首页</el-menu-item>
		  <el-menu-item index="/demos">demos</el-menu-item>
		</el-menu>
	</div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex'

  export default {
    data() {
      return {
        // activeIndex: 'index'
      };
    },
    computed: {
      ...mapGetters({
        activeIndex: 'getActiveHeadNav'
      })
    	// activeIndex () {

    	// 	return '/' + this.$route.name
    	// }
    },
    methods: {
      ...mapMutations({
        setDefaultActive: 'setActiveHeadNav'
      }),
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      }
    },
    mounted () {
      this.setDefaultActive('/'+this.$route.name)
    	// console.log(this.$route)
    }
  }
</script>