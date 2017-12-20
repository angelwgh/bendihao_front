<template>
  <div>
    <form class="form-horizontal">
      <div class="form-group">
        <label for="name" class="col-sm-2 control-label">名字:</label>
        <div class="col-sm-10">
          <input type="test" class="form-control" v-model="name" id="name" placeholder="名字">
        </div>
      </div>
      <div class="form-group">
        <label for="age" class="col-sm-2 control-label">年龄:</label>
        <div class="col-sm-10">
          <input type="test" class="form-control" v-model="age" id="age" placeholder="年龄">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-2 control-label">性别:</label>
        <div class="radio col-sm-10">
          <label>
            <input type="radio" value="男" checked v-model="sex">
            男
          </label>
          <label>
            <input type="radio" value="女" v-model="sex">
            女
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
          <button type="button" class="btn btn-default" @click="addUsers">提交</button>
        </div>
      </div>
    </form>
    <table class="table table-bordered" v-if="users">
      <tr>
        <td>id</td>
        <td>名字</td>
        <td>年龄</td>
        <td>性别</td>
        <td>操作</td>
      </tr>
      <tr v-for="user of users">
        <td>{{user.id}}</td>
        <td>{{user.name}}</td>
        <td>{{user.age}}</td>
        <td>{{user.sex}}</td>
        <td>
          <div class="btn btn-primary btn-sm" @click="update(user.id)">修改</div>
          <div class="btn btn-primary btn-sm" @click="deleteuser(user.id)">删除</div>
        </td>
      </tr>
    </table>
  </div>
  
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      id:null,
      name:'',
      sex:'男',
      age:null,
      users:null
    }
  },
  methods: {
    addUsers () {
      console.log(this.$axios)
      this.$axios({
        method: 'get',
        params: {
          name: this.name,
          age: this.age,
          sex: this.sex
        },
        url:'/ajax/users/add'
      }).then((ret)=>{
        console.log(ret)
        this.getUsers()
      })
    },
    getUsers () {
      this.$axios({
        method: 'get',
        url: '/ajax/users/getUsers'
      }).then( (ret) => {
        this.users = ret.data
      })
    },
    update (id) {
      this.$axios({
        method: 'get',
        url: '/ajax/users/updata',
        params: {
          name: this.name,
          age: this.age,
          sex: this.sex,
          id:id
        }
      })
      .then( (ret) => {
        console.log(ret)
        this.getUsers()
      })
    },
    deleteuser (id) {
      this.$axios({
        method: 'get',
        url: '/ajax/users/delete',
        params: {
          id:id
        }
      })
      .then( (ret) => {
        console.log(ret)
        this.getUsers()
      })
    }
  },

  mounted () {
    console.log(111)
    this.getUsers()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
