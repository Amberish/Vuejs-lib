<template lang="html">
  <div>

    <template v-if="type == 'plain'">
      <div :class="wrapperClass">
          <label v-if="label">
            {{label}} <span v-if="required" class="text-danger">*</span>
          </label>
          <input
            type="text"
            :name="name"
            :placeholder="placeholder"
            :class="'form-control ' + inputClass"
            :value="value">

          <div v-if="error" class="text-danger">
            <p>{{error}}</p>
          </div>
      </div>
    </template>

    <!-- For Filter -->
    <template v-else-if="type == 'filter'">
      <input type="text" class="form-control" :value="text" @input="setText" :name="name" @keyup="inputChanged">
    </template>

    <template v-else>
      <div :class="wrapperClass">
          <label v-if="label" class="col-sm-3 control-label">
            {{label}} <span v-if="required" class="text-danger">*</span>
          </label>
          <div class="col-sm-9">
            <input
              type="text"
              :name="name"
              :placeholder="placeholder"
              :class="'form-control ' + inputClass"
              :value="value">

            <div v-if="error" class="text-danger">
              <p>{{error}}</p>
            </div>
          </div>
      </div>
    </template>

  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String
    },

    wrapperClass: {
      type: String
    },

    label: {
      type: String
    },

    required: {
      type: Boolean,
      default: false
    },

    name: {
      type: String
    },

    value: {
      type: [String, Number, Array],
      default: ''
    },

    inputClass: {
      type: String,
      default: ""
    },

    placeholder: {
      type: String
    },

    error: {
      type: String
    }
  },

  data: function(){
    return {
      text: ""
    }
  },

  watch: {
    value: function(val){
      this.text = val;
    }
  },

  methods: {
    inputChanged: _.debounce(function(){
      this.$emit('text-changed', this.text);
    }, 500),

    // Function used from parent via ref
    setValue: function(value){
      this.text = value;
    },

    setText: function(event){
      this.text = event.target.value;
    }
  },
}
</script>

<style lang="css">
</style>
