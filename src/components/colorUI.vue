<template>
  <div id="colorUI" :style="panelStyle">
    <span class="UIheader">color</span><br>

    <!-- buttons to select which color to pick -->
    <div class="colorbutton" :class="{selected: isStroke}" @mousedown="pickStroke"
         @mouseover="setHint" hint="set stroke color">
      <span class="icon-stroke" :style="strokeStyle"></span>
    </div>
    <div class="colorbutton" :class="{selected: !isStroke}" @mousedown="pickFill" 
         @mouseover="setHint" hint="set fill color">
      <span class="icon-fill" :style="fillStyle"></span>
    </div>

    <!-- buttons to kill (opacity->0) stroke or fill color -->
    <es-button name="nukeStroke" @bclick="nukeStroke" hint="make stroke invisible">
      <span class="icon-no-stroke"><span class="path1"></span><span class="path2"></span></span>
    </es-button>
    <es-button name="nukeFill" @bclick="nukeFill" hint="make fill invisible">
      <span class="icon-no-fill"><span class="path1"></span><span class="path2"></span></span>
    </es-button>

    <!-- color pickers -->
    <div id="strokecolor" :style="{display: isStroke ? 'block' : 'none' }">
      <color-picker target="stroke"
                    :r="strokeColor.r"
                    :g="strokeColor.g"
                    :b="strokeColor.b"
                    :a="strokeColor.a"
                    :fullUI = "options.showColorInputs"/>
    </div>
    <div id="fillcolor" :style="{display: isStroke ? 'none' : 'block' }">
      <color-picker target="fill"
                    :r="fillColor.r"
                    :g="fillColor.g"
                    :b="fillColor.b"
                    :a="fillColor.a"
                    :fullUI = "options.showColorInputs"/>
    </div>

  </div>
</template>

<script>
import {gS} from '../main.js';
import colorPicker from './colorPicker';
import esButton from './es_button';

export default {
  components: {colorPicker, esButton},
  props: ['params', 'options', 'strokeColor', 'fillColor'],
  data: function() {return {isStroke: true}; },
  computed: {
    panelStyle: function() {
      return {display: this.params.showColor ? "block" : "none"};
    },
    strokeStyle: function() {
      return {
        color: `rgba(${this.strokeColor.r},${this.strokeColor.g},${this.strokeColor.b},${this.strokeColor.a})`,
        textStrokeColor: 'black', //textstroke not supported on IE
        textStrokeWidth: (this.strokeColor.a < 0.05) ? '0.5px' : '0px'
      };
    },
    fillStyle: function() {
      return {
        color: `rgba(${this.fillColor.r},${this.fillColor.g},${this.fillColor.b},${this.fillColor.a})`,
        textStrokeColor: 'black', //textstroke not supported on IE
        textStrokeWidth: (this.fillColor.a < 0.05) ? '0.5px' : '0px'
      };
    }
  },
  methods: {
    pickStroke: function({type, target}){ this.isStroke = true;  },
    pickFill:   function({type, target}){ this.isStroke = false; },
    nukeStroke: function(x){ gS.$emit('colorUpdate', {target: "stroke", r:0, g:0, b:0, a:0.0}); },
    nukeFill:   function(x){ gS.$emit('colorUpdate', {target: "fill",   r:0, g:0, b:0, a:0.0}); },
    setHint: function(e) {
      if(e.target.attributes.hint){
        //console.log("sethint", e.target.attributes.hint.value);
        gS.$emit('setHint', e.target.attributes.hint.value);
      }
    },
  },
}
</script>

<style scoped>
.colorbutton {
    border:1px solid #ddd;
    background: #eeeeee;
    text-indent:0px;
    text-align: center;
    border-radius: 2px;
    margin: 2px;
    padding: 3px;
    display: inline-block;
    cursor: pointer;
    color: #666;
    /* don't allow text selection */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.colorbutton:hover, .button:focus {
	foobackground: #ffdddd;
  border: solid 2px #888888;
}
.colorbutton:active {
  border: solid 2px #333333;
}
.selected {
  border: solid 2px #333333;
}
</style>
