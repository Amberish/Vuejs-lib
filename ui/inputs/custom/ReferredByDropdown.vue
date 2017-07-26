<template lang="html">
  <select name="referred_by" class="form-control" data-placeholder="Select Referred By">
    <option :value="(selected)?selected.id:''">{{(selected)?selected.name:''}}</option>
  </select>
</template>

<script>
import eventHub from '../../../EventHub';
export default {
  props: {
    selected: {
      type: Object
    }
  },

  data: function(){
    return {
      Laravel: global.Laravel
    }
  },

  methods: {
    select2AjaxObject: function(){
      let self = this;
      return {
        url: "/api/v1/contacts",
        method: "GET",
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            search_term: params.term, // search term
            page: params.page
          };
        },
        processResults: self.processResults,
        cache: true
      }
    },

    processResults: function (data, params) {
      // parse the results into the format expected by Select2
      // since we are using custom formatting functions we do not need to
      // alter the remote JSON data, except to indicate that infinite
      // scrolling can be used
      params.page = params.page || 1;

      return {
        results: data.data.data,
        pagination: {
          more: (params.page * 10) < data.data.total
        }
      };
    },

    templateResult: function(repo){
      if (repo.loading) return repo.text;

      return repo.name;
    },

    templateSelection: function(repo){
      if(repo.name != undefined)
        return repo.name;
      else
        return repo.text;
    }
  },

  mounted: function(){
    let self = this;
    $(document).ready(function(){
      // Assigned To binding with select 2 dropdown with user listing
      $(self.$el).select2({
        data: [self.Laravel.authUser],
        ajax: self.select2AjaxObject(),
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: -1,
        templateResult: self.templateResult,
        templateSelection: self.templateSelection
      });
    });
  }
}
</script>

<style lang="css">
</style>
