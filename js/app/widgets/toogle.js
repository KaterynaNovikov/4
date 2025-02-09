export const toogle = { 
  props: {
    modelValue: String, 
  },
  
  data() {
    return {
      value: this.modelValue, 
    };
  },

  watch: {
    modelValue(newValue) {
      this.value = newValue; 
    },
  },

  methods: {
    change() {
      this.$emit("update:modelValue", this.value.toString()); 
    },
  },

  template: `
    <label class="switch">
      <input type="checkbox" v-model="value" @change="change()">
      <span class="slider round"></span>
    </label>
  `,
};
