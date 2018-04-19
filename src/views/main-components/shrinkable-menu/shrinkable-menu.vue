<style lang="less">
@import './styles/menu.less';
.scroll-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .el-menu {
    position: absolute;
    width: 100% !important;
  }
}
</style>

<template>
    <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
        <slot name="top"></slot>
        <div class="scroll-wrapper" ref="scrollContainer" @wheel.prevent="handleScroll">
            <div class="el-menu" ref="scrollWrapper" :style="{top: top + 'px'}">
                <sidebar-menu v-show="!shrink" :menu-theme="theme" :menu-list="menuList" :open-names="openNames" @on-change="handleChange"></sidebar-menu>
                <sidebar-menu-shrink v-show="shrink" :menu-theme="theme" :menu-list="menuList" :icon-color="shrinkIconColor" @on-change="handleChange"></sidebar-menu-shrink>
            </div>
        </div>
    </div>
</template>

<script>
import sidebarMenu from './components/sidebarMenu.vue';
import sidebarMenuShrink from './components/sidebarMenuShrink.vue';
import util from '@/libs/util';
const delta = 15;
export default {
  name: 'shrinkableMenu',
  components: {
    sidebarMenu,
    sidebarMenuShrink
  },
  props: {
    shrink: {
      type: Boolean,
      default: false
    },
    menuList: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      default: 'dark',
      validator(val) {
        return util.oneOf(val, ['dark', 'light']);
      }
    },
    beforePush: {
      type: Function
    },
    openNames: {
      type: Array
    }
  },
  data() {
    return {
      top: 0
    };
  },
  computed: {
    bgColor() {
      return this.theme === 'dark' ? '#495060' : '#fff';
    },
    shrinkIconColor() {
      return this.theme === 'dark' ? '#fff' : '#495060';
    }
  },
  methods: {
    handleChange(name) {
      let willpush = true;
      if (this.beforePush !== undefined) {
        if (!this.beforePush(name)) {
          willpush = false;
        }
      }
      if (willpush) {
        this.$router.push({
          name: name
        });
      }
      this.$emit('on-change', name);
    },
    handleScroll(e) {
      const eventDelta = e.wheelDelta || -e.deltaY * 3;
      const $container = this.$refs.scrollContainer;
      const $containerHeight = $container.offsetHeight;
      const $wrapper = this.$refs.scrollWrapper;
      const $wrapperHeight = $wrapper.offsetHeight;

      if (eventDelta > 0) {
        this.top = Math.min(0, this.top + eventDelta);
      } else {
        if ($containerHeight - delta < $wrapperHeight) {
          if (this.top < -($wrapperHeight - $containerHeight + delta)) {
            this.top = this.top;
          } else {
            this.top = Math.max(
              this.top + eventDelta,
              $containerHeight - $wrapperHeight - delta
            );
          }
        } else {
          this.top = 0;
        }
      }
    }
  }
};
</script>
