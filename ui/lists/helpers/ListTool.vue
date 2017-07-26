<template lang="html">
  <div class="grid-tools">
      <a class="dropdown-toggle tool-dropdown-toggle">
          <i class="fa fa-cog"></i>
      </a>
      <ul class="dropdown-menu dropdown-messages">
          <li><h5>Columns</h5></li>
          <li v-for="(column, index) in reactiveToolConfig.columns">
              <input
                type="checkbox"
                :checked="(column.checked == undefined || column.checked)?true:false"
                :disabled="(column.disabled)?true:false"
                v-model="column.checked">
                {{column.name}}
          </li>
          <li class="divider"></li>
          <li>
            <input
              type="checkbox"
              :checked="(reactiveToolConfig.hide_filter)?true:false"
              v-model="reactiveToolConfig.hide_filter">
              Hide Filter
          </li>
          <li class="divider"></li>
          <li><h5>Rows</h5></li>
          <li>
              <select
                name="rows"
                class="form-control m-b input-sm table_rows"
                v-model="reactiveToolConfig.rows">
                  <option :selected="(reactiveToolConfig.rows == 0)?true:false" value='0'>Rows</option>
                  <option :selected="(reactiveToolConfig.rows == 20)?true:false" value='20'>20</option>
                  <option :selected="(reactiveToolConfig.rows == 50)?true:false" value='50'>50</option>
                  <option :selected="(reactiveToolConfig.rows == 100)?true:false" value='100'>100</option>
              </select>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
  props: {
    toolConfig: {
      type: Object
    },

    listingType: {
      type: String
    }
  },

  data: function(){
    return {
      data_tool_config: {},
      storage_tool_config: {}
    };
  },

  watch: {
    // Watch for changes in columns. Specially for 'checked' property.
    'reactiveToolConfig.columns': {
      handler: function(columns){
        this.setColumns(columns);
        // Store current state.
        this.setStorageConfig(this.reactiveToolConfig);
      },
      //Deep analyse columns array
      deep: true
    },

    // Watch for hide filter property
    'reactiveToolConfig.hide_filter': function(filter){
      this.setHideFilter(filter);
      // Store current state.
      this.setStorageConfig(this.reactiveToolConfig);
    },

    // Watch for rows property
    'reactiveToolConfig.rows': function(rows){
      this.setRows(rows);
      // Store current state.
      this.setStorageConfig(this.reactiveToolConfig);
    }
  },

  computed: {
    reactiveToolConfig: function(){
      if(!_.isEmpty(this.storage_tool_config))
        this.data_tool_config = Object.assign({}, this.data_tool_config, this.storage_tool_config);
      return this.data_tool_config;
    }
  },

  methods: {

    formatConfigData: function(config){
      let self = this;
      // Add checked property for column objects where missing.
      config.columns = _.map(config.columns, function(column){
        if(column.checked == undefined){
          // If missing checked property, considered checked.
          self.$set(column, 'checked', true);
        }
        return column;
      });

      return config;
    },

    setColumns: function(columns){
      this.$emit('columns-changed', columns);
    },

    setHideFilter: function(val){
      this.$emit('hide-filter-changed', val);
    },

    setRows: function(val){
      this.$emit('rows-changed', val);
    },

    // Loading configuration from session/cookie storage, through API.
    loadStorageConfig: function(){
      if(this.listingType){
        let self = this;
        axios.get('/table-tool/storage/' + this.listingType)
          .then(res => {
            if(!_.isEmpty(res.data.data))
              self.storage_tool_config = Object.assign({}, self.storage_tool_config, res.data.data);
          })
          .catch(err => {});
      }
    },

    // Setting configuration to session/cookie storage, through API.
    setStorageConfig: function(config){
      if(this.listingType){
        let self = this;
        axios.post('/table-tool/storage', {
          name: self.listingType,
          content: config
        })
          .then(res => {})
          .catch(err => {});
      }
    }
  },

  created: function(){
    // Load configuration from storage,
    // before the component is mounted.
    this.loadStorageConfig();
  },

  mounted: function(){
    // Load formated prop toolConfig to local data_tool_config.
    this.data_tool_config = Object.assign({}, this.data_tool_config, this.formatConfigData(this.toolConfig));
  }
}
</script>

<style lang="css">
</style>
