<template lang="html">
  <div>
    <select ref="assignedTo" name="assigned_to" class="form-control" data-placeholder="Select Assigned To">
      <option :value="(selected)?selected.id:''">{{(selected)?selected.name:''}}</option>
    </select>
  </div>
</template>

<script>
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
        url: "/api/v1/admin/admin-user/search-with-pagination",
        method: "post",
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            search_term: params.term, // search term
            _token: self.Laravel.csrfToken,
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
    },

    assignedToChanged: function(){
      this.$emit('assigned-to-changed',this.$refs.assignedTo.value);
    },

    // Function used to set value
    setValue: function(value){
      if(value == '')
        $(this.$refs.assignedTo).val(0).trigger('change');
      else
        $(this.$refs.assignedTo).val(value).trigger('change');
    },
  },

  mounted: function(){
    let self = this;
    $(document).ready(function(){
      // Assigned To binding with select 2 dropdown with user listing
      $(self.$refs.assignedTo).select2({
        data: [self.Laravel.authUser],
        ajax: self.select2AjaxObject(),
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: -1,
        templateResult: self.templateResult,
        templateSelection: self.templateSelection
      })
      .on('change', self.assignedToChanged);
    });
  }
}
</script>

<style lang="css">
</style>
