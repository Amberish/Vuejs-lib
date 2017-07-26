<template lang="html">
    <dropdown
      :type="dropdownType"
      :wrapper-class="wrapperClass"
      :label="label"
      :required="required"
      :name="name"
      :placeholder="placeholder"
      :items="items"
      :selected="selected"
      :input-class="inputClass"
      :multiple="multiple"
      :error="error"
      :property-name="propertyName"
      v-on:dropdown-changed="dropdownChanged">
      <template v-if="dropdownType == 'input-group'">
        <slot></slot>
      </template>
    </dropdown>
</template>

<script>
import Dropdown from '../Dropdown.vue';
export default {
  props: {
    apiUrl: {
      type: String
    },

    dropdownType: {
      type: String
    },

    wrapperClass: {
      type: String,
      default: ""
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

    placeholder: {
      type: String
    },

    selected: {
      type: [String, Number, Array]
    },

    inputClass: {
      type: String
    },

    multiple: {
      type: Boolean,
      default:false
    },

    error: {
      type: String
    },

    propertyName: {
      type: String,
      default: 'name'
    }
  },

  data: function(){
    return {
      items: []
    };
  },

  watch: {
    apiUrl: function(url){
      this.items = [];
      this.fetchItems();
    }
  },

  methods: {
    fetchItems: function(){
      if(this.apiUrl == '')
        return false;
        
      let self = this;
      axios.get(this.apiUrl)
        .then(res => {
          self.items = res.data.data;
          self.$emit('dropdown-data-loaded', self.items);
        })
        .catch(err => {});
    },

    dropdownChanged: function(value){
      this.$emit('dropdown-changed', value)
    }
  },

  mounted: function(){
    this.fetchItems();
  },

  components: {
    'dropdown': Dropdown
  }
}
</script>

<style lang="css">
</style>
