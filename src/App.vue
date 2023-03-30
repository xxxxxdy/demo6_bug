<template>
  <div id="toolbar">
    <!--  标题的小字  -->
    <div class="text" style="padding-left: 15%; padding-top: 15%; font-size: 32px;display: inline-block;">TSBC</div>
    <div class="text" style="margin-bottom:20%; padding-left: 2px;font-size: 14px; width: 100px; line-height:14px; display: inline-block;">time series barcode</div>
  
    <FileReader/>
    <div id="split-line" ></div>
    <ToolBar/>

    <!-- 文档的超链接，下面那行小字 -->
    <div style="margin-left: 15%;  margin-top: 80%;">
      <div style="color:#809FB8; font-size: 16px; ">Instructions
        <a href="./data/Intruduction.pdf">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
          </svg>
        </a>
      </div>
      <!--div style="color:#C6D7E5; font-size: 14px;"> @Sun Yat-sen University</div-->
    </div>

  </div>
  <div style="display: inline-block; height: 10%;">  <!-- 这个height 不重要但是不能超过100%否则页面会滚动-->
    <div id="windows">
      <div style="display:inline-block; vertical-align:top;  margin-left: 40px; padding-top: 20px; height: 100% - 20px; grid-row: 1;  grid-column: 2;">
        <LineChart/>
        <AnalysisModule/>
      </div>
      
      <div style="display:inline-block; vertical-align:top; margin-left: 40px; padding-top: 20px; height: 100% - 20px; grid-row: 1; grid-column: 1;">
        <CodeCenter/>
      </div>
    </div>
  </div>
  
</template>

<style scoped>
#toolbar{
  width: 300px;
  height: max(100%, 1320px);
  background-color: #F1F4FA;
  display: inline-block;
  vertical-align:top;
}

#windows{
  display: grid;
  grid-template-columns: var(--totalwidth) 900px;
  position: absolute;
  top: 0px;
  height: 100%;
}

svg{
  position: absolute;
  width: 20px;
  margin-left: 20px;
}

.text{
  color:#2932FF
}

#split-line{
  height: 2px;
  background-color:#C6D7E5;
  margin-top: 8%;
  margin-left: 15%;
  margin-right: 10%;
  margin-bottom: 8%;
}

</style>

<script>
import FileReader from './components/FileReader.vue'
import LineChart from './components/LineChart.vue';
import ToolBar from './components/ToolBar.vue';
import AnalysisModule from './components/AnalysisModule.vue';
import CodeCenter from './components/CodeCenter.vue';

export default{
    data() {
        return {
          grid_style:{'--totalwidth': '300px'}
        };
    },
    methods: {
      changeColumns(msg){
        this.grid_style['--totalwidth'] = 300 * msg +'px'
      }
    },
    mounted() {
    },
    components: { FileReader, LineChart, ToolBar, AnalysisModule, CodeCenter}
}
</script>