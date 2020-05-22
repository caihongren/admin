<template>
  <div :class="{'has-logo':showLogo}">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      const list = this.$router.options.routes

      const newlist = []
      if (sessionStorage.getItem('user')) {
        const user = JSON.parse(sessionStorage.getItem('user'))
        if (user.accountNumber == 'admin') {
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (
              item.path == '/' ||
             item.path == '/IndustryDataSource' ||
             item.path == '/IndustryEnterpriseNode' ||
             item.path == '/IndustryPersonnel' ||
             item.path == '/IndustryLog' ||
             item.path == '/IndustryAuthorization' ||
             item.path == '/IndustrySystem' ||
             item.path == '/IndustryPersonal') {
              newlist.push(item)
            }
          }
        } else if (user.accountNumber == 'data1') {
          for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.path == '/IndustryNode' || item.path == '/' || item.path == '/dataIndustryDataSource' || item.path == '/IndustryPersonal' || item.path == '/importTask') {
              newlist.push(item)
            }
          }
        }
      }

      return newlist
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style>
.el-menu-item.is-active {
   background-color:#1f2d3d !important;
}
</style>

