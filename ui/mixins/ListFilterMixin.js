export default {
  data: function(){
    return {
      filterInputs: {},
      page: 0, //Current Page
      sort: '',
      sort_order: '',
      rows: 0,

      watcherProperties: [
        'filterInputs',
        'page',
        'sort',
        'sort_order',
        'rows'
      ],
    }
  },

  methods: {
    // Event listener for sort event
    listSorted: function(sort_info){
      this.sort = sort_info.field;
      this.sort_order = sort_info.order
    },

    // Event listener for filter change event
    listFilterChanged: function(filters){
      this.filterInputs = Object.assign({}, this.filterInputs, filters);
    },

    // Event listener for page event
    listPageChanged: function(page){
      this.page = page;
    },

    listRowsChanged: function(rows){
      this.rows = rows;
    },

    // Composing all filter, pagination, sorting data to be fed to API.
    composeAPIData: function(){

      let data = [
        this.filterInputs,
        { page: this.page},
        { sort: this.sort, sort_order: this.sort_order },
        { rows: this.rows}
      ];

      //Compose api data
      //Final data: {filters, page, sort, sort_order}
      return Object.assign(
          {},
          ...data
        );
    },

    // Setting watcher for all properties  defined in second parameter.
    setDataWatcher: function(properties, self, callback){
      // Setting watchers for properties used in API, like, filters, sort and pagination
      _.forEach(properties, function(property){
        self.$watch(property, callback.bind(self));
      });
    }
  },

  mounted: function(){
    //Function defined in mixin. Apply watcher to proprties define in 2 param array
    this.setDataWatcher(this.watcherProperties, this, this.fetchResult);
    this.fetchResult();
  },
}
