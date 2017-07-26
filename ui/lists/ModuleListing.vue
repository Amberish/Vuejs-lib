<template lang="html">
  <div>
    <list
      :columns="reactiveColumns"
      :pages="pages"
      :table-tool="tableTool"
      :tool-config="toolConfig"
      :listing-type="listingType"
      :filter-action-checkbox="filterActionCheckbox"
      :bulk-actions="bulkActions"
      :selected-items="selectedItems"
      v-on:list-sorted="listSorted"
      v-on:list-action-checkbox-changed="listActionCheckboxChanged"
      v-on:list-filter-changed="listFilterChanged"
      v-on:list-page-changed="listPageChanged"
      v-on:list-rows-changed="listRowsChanged"
      v-on:list-columns-changed="listColumnsChanged">

      <!-- Bulk Action Slot -->
      <template slot="bulk-action">
        <bulk-action
          :base-path="actionBasePath"
          :basic="bulkBasicActions"
          :external="bulkExternalActions"
          v-on:bulk-actions-loaded="loadBulkActions"
          v-on:bulk-action-clicked="bulkActionClicked">
        </bulk-action>
      </template>

      <!-- Loading icon untill results not loaded -->
      <tr v-if="loading">
        <td :colspan="columns.length" class="text-center">
          <span class="fa fa-circle-o-notch fa-spin fa-2x"></span>
        </td>
      </tr>

      <!-- Actual Result Slot -->
      <tr v-for="result in results">

        <td v-if="bulkActions">
          <input type="checkbox" v-model="selectedItems" :value="result['_id']" @change="selectedItemsUpdated">
        </td>

        <td v-if="column.checked == undefined || column.checked" v-for="column in reactiveColumns">
          <span
            v-if="column.format_type == 'html'"
            v-html="result[column.field_name]">
          </span>
          <span v-else-if="column.format_type == 'date'">
            {{formatDate(result[column.field_name], systemSetup('date-format'))}}
          </span>
          <span v-else-if="column.format_type == 'datetime'">
            {{formatDate(result[column.field_name], systemSetup('date-format'))}}
            {{formatTime(result[column.field_name], systemSetup('time-format'))}}
          </span>
          <span v-else-if="column.format_type == 'link'">
            <a :href="actionBasePath + '/' + result['_id']">{{result[column.field_name]}}</a>
          </span>
          <span v-else-if="column.format_type == 'name-address'">
            <a :href="actionBasePath + '/' + result['_id']">{{result['name']}}</a><br/>
            <small v-if="result['address']" v-html="result['address']">
            </small>
          </span>
          <span v-else>
            {{result[column.field_name]}}
          </span>
        </td>

        <td class="text-right">
          <row-action
            :base-path="actionBasePath"
            :item-id="result['_id']"
            :basic="basicActions"
            :external="externalActions"
            v-on:row-action-clicked="rowActionClicked">
          </row-action>
        </td>

      </tr>

    </list>

    <!-- Delete Individual Item Modal - Row Action -->
    <delete-item-modal
      modal-id="delete-item-modal"
      :action="deleteItemAction"
      :item="listingType">
    </delete-item-modal>

    <!-- Delete Bull Items Modal - Bulk Action -->
    <bulk-delete-modal
      modal-id="delete-selected-modal"
      :action="deleteBulkAction"
      :item="listingType"
      :item-ids="selectedItems">
    </bulk-delete-modal>
  </div>
</template>

<script>
import List from './List.vue';

import ListFilterMixin from '../mixins/ListFilterMixin';
import DateMixin from '../mixins/DateMixin';
import ListMixin from '../mixins/ListMixin';

import RowAction from './helpers/RowAction.vue';
import BulkAction from './helpers/BulkAction.vue';

import DeleteItemModal from '../modals/DeleteModal.vue';
import BulkDeleteModal from '../modals/BulkDeleteModal.vue';

export default {

  mixins: [ListFilterMixin, DateMixin],

  props: {
    actionBasePath: {
      type: String,
      required: true
    },

    apiUrl: {
      type: String,
      required: true
    },

    columns: {
      type: Array,
      required: true
    },

    tableTool: {
      type: Boolean,
      default: true
    },

    toolConfig: {
      type: Object,
      default: function(){
        return {
          hide_filter: false,
          rows: 0
        }
      }
    },

    listingType: {
      type: String
    },

    basicActions: {
      type: [Array, String]
    },

    externalActions: {
      type: Array,
    },

    bulkBasicActions: {
      type: [Array, String]
    },

    bulkExternalActions: {
      type: Array
    },

    reload: {
      type: Boolean,
      default: false
    }
  },

  data: function(){
    return {
      loading: true,

      pages: 0,
      // Expecting all results object to contain '_id' for action.
      results: [],

      data_columns: [],

      deleteItemAction: '',

      deleteBulkAction: '',

      bulkActions: [],

      selectedItems: [],

      filterActionCheckbox: false
    };
  },

  computed: {
    reactiveColumns: function(){
      this.data_columns = Object.assign([], this.columns, this.data_columns);
      return this.data_columns; //Return reactive columns
    }
  },

  watch: {
    reload: function(val){
      if(val == true){
        this.fetchResult();
      }
    }
  },

  methods: {
    fetchResult: function(){
      let self = this;
      // composeAPIData function defined in mixin
      axios.post(this.apiUrl, this.composeAPIData())
        .then(res => {
          let data = res.data.data;
          // Hide loader
          self.loading = false;
          self.pages = Math.ceil(data.total/data.per_page);
          self.results = data.data;
        })
        .catch(err => {});
    },

    listColumnsChanged: function(columns){
      this.data_columns = Object.assign([], this.data_columns, columns);
    },

    listActionCheckboxChanged: function(checked){
      let self = this;
      if(checked){
        _.forEach(this.results, function(result){
          if(self.selectedItems.indexOf(result._id) == -1)
            self.selectedItems.push(result._id);
        });
      } else {
        let result_ids = _.map(this.results, '_id');
        // Check if all result items on page are selected
        if(_.difference(result_ids, this.selectedItems).length == 0){
          _.forEach(this.results, function(result){
            self.selectedItems.splice(self.selectedItems.indexOf(result._id), 1);
          });
        }
      }
    },

    selectedItemsUpdated: function(){
      // console.log(this.selectedItems);
    },

    rowActionClicked: function(action){
      switch (action.type) {
        case 'delete':
          this.deleteItemAction = this.actionBasePath + '/' + action.item_id;
          break;
      }
    },

    loadBulkActions: function(actions){
      this.bulkActions = actions;
    },

    bulkActionClicked: function(action){
      if(this.selectedItems.length == 0){
        toastr.error('Please select atleast one item!');
        return false;
      }

      switch (action.type) {
        case 'delete':
          this.deleteBulkAction = action.action;
          $('#delete-selected-modal').modal();
          break;
      }
    }
  },

  components: {
    'list': List,
    'delete-item-modal': DeleteItemModal,
    'bulk-delete-modal': BulkDeleteModal,
    'row-action': RowAction,
    'bulk-action': BulkAction
  }
}
</script>

<style lang="css">
</style>
