<template lang="html">
  <div>
    <template v-if="type == 'plain'">
      <div :class="wrapperClass">
        <label v-if="label">{{label}} <span class="text-danger" v-if="required">*</span></label>
        <select
          ref="dropdown"
          :name="name"
          :class="'form-control ' + inputClass"
          :data-placeholder="placeholder"
          :multiple="multiple">
          <option v-if="placeholder"></option>
          <option
            :selected="(typeof selected == 'object' && selected.indexOf(item.id) > -1 )?true:((typeof selected != 'object' && selected == item.id)?true:false)"
            :value="item.id"
            v-for="item in items">
            {{item[propertyName]}}
          </option>
        </select>

        <div v-if="error" class="text-danger">
          <p>{{error}}</p>
        </div>
      </div>
    </template>

    <template v-else-if="type == 'input-group'">
      <div :class="wrapperClass">
        <label v-if="label">{{label}} <span class="text-danger" v-if="required">*</span></label>
        <div class="input-group">
          <select
            ref="dropdown"
            :name="name"
            :class="inputClass"
            :data-placeholder="placeholder"
            :multiple="multiple">
            <option v-if="placeholder"></option>
            <option
              :selected="(typeof selected == 'object' && selected.indexOf(item.id) > -1 )?true:((typeof selected != 'object' && selected == item.id)?true:false)"
              :value="item.id"
              v-for="item in items">
              {{item[propertyName]}}
            </option>
          </select>

          <slot></slot>
        </div>

        <div v-if="error" class="text-danger">
          <p>{{error}}</p>
        </div>
      </div>
    </template>

    <template v-else-if="type == 'custom'">
      <div class="form-group">
          <label v-if="label" class="col-sm-3 control-label">
            {{label}}
            <span v-if="required" class="text-danger">*</span>
          </label>
          <div class="col-sm-9">
              <slot></slot>
          </div>
      </div>
    </template>

    <template v-else>
          <div class="form-group">
            <label v-if="label" class="col-sm-3 control-label">
                {{label}} <span v-if="required" class="text-danger">*</span>
            </label>
            <div class="col-sm-9">
              <select
                ref="dropdown"
                :name="name"
                :class="'form-control ' + inputClass"
                :data-placeholder="placeholder"
                :multiple="multiple">
                <option v-if="placeholder"></option>
                <option
                  :selected="(typeof selected == 'object' && selected.indexOf(item.id) > -1 )?true:((typeof selected != 'object' && selected == item.id)?true:false)"
                  :value="item.id"
                  v-for="item in items">
                  {{item[propertyName]}}
                </option>
              </select>

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
      type: String,
      default: ""
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

    value: {
      type: [String, Number, Array]
    },

    inputClass: {
      type: String,
      default: ""
    },

    placeholder: {
      type: String
    },

    selected: {
      type: [String, Number, Array]
    },

    items: {
      type: Array,
      required: true,
      default: []
    },

    multiple: {
      type: Boolean,
      default: false
    },

    error: {
      type: String
    },

    propertyName: {
      type: String,
      default: 'name'
    }

  },

  watch: {
    items: function(items){
      $(this.$refs.dropdown).trigger('change');
    },

    value: function(value){
      $(this.$refs.dropdown).val(value).trigger('change');
    }
  },

  methods: {
    dropdownChanged: function(value){
      this.$emit('dropdown-changed', value)
    }
  },

  mounted: function(){
    let self = this;
    $(document).ready(function(){
      // Adding select 2 to dropdown
      $(self.$refs.dropdown).select2()
      .on('change', function(value){
        //emit dropdown change event
        self.dropdownChanged($(this).val())
      });

      //If selected is provided, trigger change event.
      if(self.selected){
        $(self.$refs.dropdown).trigger('change');
        // Need to trigger twice to ensure all selected dropdowns are loaded properly.
        setTimeout(function () {
          $(self.$refs.dropdown).trigger('change');
        }, 800);
      }
    });
  }
}
</script>

<style lang="css">
</style>
