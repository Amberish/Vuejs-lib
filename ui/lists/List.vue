<template lang="html">
  <div class="table-list">
      <table class="table table-striped table-hover">
          <thead>
            <tr>
                <!-- Table Bulkaction Column -->
                <th v-if="bulkActions">
                  <slot name="bulk-action"></slot>
                </th>
                <!-- End Bulkaction Column -->

                <!-- Table Heading Columns -->
                <th
                  v-for="column in reactiveColumns"
                  v-if="column.checked == undefined || column.checked"
                  :class="(column.class != undefined)?column.class:''"
                  @click="(column.sort == undefined || column.sort)?sort(column.field_name):''">
                  {{column.name}}
                  <span v-if="column.sort == undefined || column.sort" class="fa fa-sort" :class="(sortKey == column.field_name)?(sortOrders[column.field_name] > 0 ? 'fa-sort-asc' : 'fa-sort-desc'):''"></span>
                </th>
                <!-- End Table Heading Columns -->

                <!-- Table Tools -->
                <th v-if="tableTool">
                  <list-tool
                    :tool-config="completeTableToolInput"
                    :listing-type="listingType"
                    v-on:columns-changed="columnsChanged"
                    v-on:hide-filter-changed="hideFilterChanged"
                    v-on:rows-changed="rowsChanged">
                  </list-tool>
                </th>
                <!-- End Table Tools -->
            </tr>

          </thead>
          <tbody>
            <tr v-if="!hideFilter">
              <!-- Bulk Action Checkbox -->
              <td v-if="bulkActions">
                <input type="checkbox" v-model="data_filter_action_checkbox" @change="actionCheckboxChanged">
              </td>

              <!-- Filters -->
              <td v-if="column.checked == undefined || column.checked" v-for="column in reactiveColumns">
                <!-- Company Dropdown -->
                <dynamic-dropdown
                  ref="filters"
                  v-if="column.filter_type && processFilterType(column.filter_type) == 'company_type'"
                  dropdown-type="plain"
                  api-url="/dropdown/company-types"
                  placeholder="Select Company Type(s)"
                  :multiple="true"
                  v-on:dropdown-changed="inputChanged($event, column.field_name)">
                </dynamic-dropdown>

                <!-- Date Input -->
                <date-input
                  ref="filters"
                  v-else-if="column.filter_type && processFilterType(column.filter_type)[0] == 'date'"
                  :type="processFilterType(column.filter_type)[1]"
                  v-on:date-changed="inputChanged($event, column.field_name)">
                </date-input>

                <!-- Assigned To Input -->
                <assigned-to-input
                  ref="filters"
                  v-else-if="column.filter_type && processFilterType(column.filter_type) == 'assigned_to'"
                  v-on:assigned-to-changed="inputChanged($event, column.field_name)" >
                </assigned-to-input>

                <!-- Text Input -->
                <text-input
                  ref="filters"
                  v-else
                  type="filter"
                  v-on:text-changed="inputChanged($event, column.field_name)">
                </text-input>

              </td>
              <!-- End Filters -->

              <!-- Last column -->
              <td class="text-right">
                  <a @click="clearFilter" class="btn btn-white btn-sm">Clear Filter</a>
              </td>

            </tr>

            <!-- Actual data slot -->
            <slot></slot>
          </tbody>
      </table>

      <div class="text-center">
        <paginate
          ref="paginate"
          v-if="pages > 0"
          :click-handler="pageChanged"
          :page-count="pages"
          :prev-text="'«'"
          :next-text="'»'"
          :container-class="'pagination'">
        </paginate>
      </div>

      <slot name="pagination"></slot>
  </div>
</template>

<script>

import ListTool from './helpers/ListTool.vue';
import Paginate from 'vuejs-paginate';

import TextInput from '../inputs/Text.vue';
import DynamicDropdown from '../inputs/dropdowns/DynamicDropdown.vue';
import DateInput from '../inputs/Date.vue';
import AssignedToInput from '../inputs/custom/AssignedTo.vue';

export default {

  props: {
    // Columns data format:
    // columns => [{
    // name: required,
    // field_name: required,
    // sort: optional(default:true) - give sorting on column.
    // checked: optional(default:true),
    // disabled: optional(default:false),
    // filter_type: optional(default:text),
    // format_type: optional(default:text)
    // }]
    columns: {
      type: Array,
      required: true,
      // Validate structure of column object
      validator: function(columns){
        let column_validate = [];
        let column_count = columns.length;
        _.forEach(columns, function(column){
          // Mandatory columns
          if(column.hasOwnProperty('name') &&
              column.hasOwnProperty('field_name')){
              column_validate.push(true);
          } else {
            column_validate.push(false);
          }
        });
        //Column count equals number of true validated columns
        if(column_count == _.filter(column_validate, function(c){ return c;}).length){
          return true;
        } else {
          return false;
        }
      }
    },

    tableTool: {
      type: Boolean,
      default: true
    },

    pages: {
      type: Number,
      default: 0
    },

    toolConfig: {
      type: Object
    },

    listingType: {
      type: String
    },

    filterActionCheckbox: {
      type: Boolean
    },

    bulkActions: {
      type: Array
    },

    selectedItems: {
      type: Array,
      default: []
    }
  },

  computed: {
    reactiveColumns: function(){
      this.data_columns = Object.assign([], this.columns, this.data_columns);
      return this.data_columns;
    },

    // Include both columns and other tool items.
    completeTableToolInput: function(){
      return Object.assign({}, {columns: this.columns}, this.toolConfig);
    },

    computedFilterActionCheckbox: function(){
      return this.filterActionCheckbox || this.data_filter_action_checkbox;
    }
  },

  data: function(){
    return {
      data_columns: [],
      sortKey: '',
      sortOrders: {},
      filterInputs: {},
      hideFilter : false,
      rows: 0,

      data_filter_action_checkbox: false
    }
  },

  watch: {
    filterActionCheckbox: function(val){
      this.data_filter_action_checkbox = val;
    }
  },

  methods: {
    emitListFilterChangeEvent: function(filters){
      this.$emit('list-filter-changed', filters);
    },

    inputChanged: function(value, field_name){
      //set filter manually.
      this.$set(this.filterInputs, field_name, value);
      this.emitListFilterChangeEvent(this.filterInputs);
    },

    sort: function(field){
      this.sortKey = field;
      this.$set(this.sortOrders, field, this.sortOrders[field] * -1);

      //emit the column field name that triggered change.
      this.$emit('list-sorted', {
        field: field,
        order: (this.sortOrders[field] > 0)?'asc':'desc'
      });
    },

    pageChanged: function(page_no){
      //Emit page number to parent
      this.$emit('list-page-changed', page_no);
    },

    columnsChanged: function(columns){
      this.data_columns = Object.assign([], this.data_columns, columns);
      // Emit columns for columns used in top level component
      this.$emit('list-columns-changed', columns);
    },

    // Setting hide filter, val - true/false
    hideFilterChanged: function(val){
      this.hideFilter = val;
    },

    // Setting rows,
    rowsChanged: function(val){
      this.$emit('list-rows-changed', val);

      // Trigger event to change page to first page.
      this.pageChanged(1);
    },

    //Initializing filters with blank value.
    initializeFilter: function(){
      let self = this;
      //setting sort order to 1 for all
      _.forEach(this.columns, function(column){
        self.$set(self.filterInputs, column.field_name, "");
      });
    },

    clearFilter: function(){
      let self = this;
      this.initializeFilter();
      _.forEach(this.$refs.filters, function(filter){
        if(typeof filter.setValue !== "undefined")
          filter.setValue("");
        if(typeof filter.setDateValue !== "undefined")
          filter.setDateValue("");
      });
      this.emitListFilterChangeEvent(this.filterInputs);
    },

    processFilterType: function(filter_type){
      if(filter_type.indexOf(':') > 0){
        return [
          filter_type.substr(0, filter_type.indexOf(':')),
          filter_type.substr(filter_type.indexOf(':') + 1)
        ];
      } else
        return filter_type;
    },

    actionCheckboxChanged: function(){
      this.$emit('list-action-checkbox-changed', this.computedFilterActionCheckbox);
    }
  },

  created: function(){
    let self = this;
    this.initializeFilter();
  },

  mounted: function(){
    let self = this;
    //setting sort order to 1 for all
    _.forEach(this.columns, function(column){

      self.sortOrders[column.field_name] = 1;
    });
  },

  components: {
    'list-tool': ListTool,
    'paginate': Paginate,

    'text-input': TextInput,
    'dynamic-dropdown': DynamicDropdown,
    'date-input': DateInput,
    'assigned-to-input': AssignedToInput
  }
}
</script>

<style lang="css">
</style>
