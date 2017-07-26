<template lang="html">
  <div>
    <select ref="company" id="company" :name="name" class="select2 form-control" :data-placeholder="placeholder">
      <option :value="(selected)?selected.id:''">{{( selected )?((selected.company_name)?selected.company_name:selected.name):''}}</option>
    </select>

    <!-- Add Member Modal -->
    <add-member-modal
      v-on:new-member-created="newMemberCreated">
    </add-member-modal>
  </div>
</template>

<script>
import addMemberModal from '../../modals/AddMemberModal.vue';
import eventHub from '../../../EventHub';
export default {
  props: {
    selected: {
      type: Object
    },

    name: {
      type: String,
      default: 'company_id'
    },

    placeholder: {
      type: String,
      default: 'Select Company'
    }
  },

  data: function(){
    return {
      Laravel: global.Laravel
    }
  },

  components: {
    'add-member-modal': addMemberModal
  },

  methods: {
    select2AjaxObject: function(){
      let self = this;
      return {
        url: "/api/v1/company/search-with-pagination",
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
      let self = this;
      let results = [];
      if(params.page == 1){
        //Added custom button at the top to trigger modal for create new member company.
        results[0] = {id: 'button', text: '+ Add New Item'};
        // Triggering change event after 10ms,
        // Expecting select2 render result after 10ms.
        setTimeout(function () {
          //Trigger change event so action performed on change are reflected.
          $(self.$refs.company).trigger('change');
        }, 10);
      }

      // Add all ajax data to results var
      _.forEach(data.data.data, function(record){
        results.push(record);
      });

      return {
        results: results,
        pagination: {
          more: (params.page * 10) < data.data.total
        }
      };
    },

    templateResult: function(repo){
      if (repo.loading) return repo.text;

      // Check for id with matching text'button'.
      // If found, style it like a button.
      if(repo.id && typeof repo.id == 'string' && repo.id.indexOf('button') != -1)
        return $('<button class="col-md-12 btn btn-warning">' + repo.text + '</button>');

      // Else if name property exist, return name
      else if(repo.name)
        return repo.name;

      // Else return text
      else
        return repo.text;
    },

    templateSelection: function(repo){
      // Condition for placeholder
      if(!repo.id && repo.text){
        return repo.text;
      }

      // Check for id with matching text'button'.
      // If found, return blank
      if(repo.id && repo.id.indexOf('button') != -1){
        return '';
      }

      // Else if name property exist, return name
      else if(repo.name)
        return repo.name;

      // Else return text
      else
        return repo.text;
    },

    // Function triggered on event 'new-member-created',
    // used for "add-member-modal" component
    newMemberCreated:  function(member){
      //Emit a company change event
      eventHub.$emit('company-selected', $(this.$refs.company).val());
      let member_name = (member.name)?member.name:member.company_name;

      $(this.$refs.company).append('<option selected value="' + member.id + '">' + member_name + '</option>');
      $(this.$refs.company).trigger('change');
    }
  },

  mounted: function(){
    let self = this;
    $(document).ready(function(){
      // Assigned To binding with select 2 dropdown with user listing
      $(self.$refs.company).select2({
        data: [],
        ajax: self.select2AjaxObject(),
        escapeMarkup: function (markup) { return markup; },
        minimumInputLength: -1,
        templateResult: self.templateResult,
        templateSelection: self.templateSelection
      })
      //Change event listener to update "Add Item Button" design and add action to button click.
      .on('change', function(){
        //Emit a company change event
        eventHub.$emit('company-selected', $(this).val());

        $('.select2-results ul#select2-company-results li:first-child').css({'padding': '0px', 'min-height': '34px'});
        $('.select2-results ul#select2-company-results li:first-child').on('mouseup', function(e) {
            $('#add-new-member-modal').modal();
        });
      });
    });
  }
}
</script>

<style lang="css">
</style>
