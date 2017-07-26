<template lang="html">
  <form-modal
    title="Add New Member"
    modal-id="add-new-member-modal"
    modal-size="lg"
    api-url="company/create-instant"
    v-on:form-submit-response="newMemberCreated"
    v-on:form-errors="getErrors">

    <div class="row">
        <div class="col-sm-6">
          <text-input
            wrapper-class="form-group"
            :label="trans('admin.input_fields.name')"
            name="modal_company_name"
            :required="true"
            :error="(errs && errs.company_name)?errs.company_name[0]:''">
          </text-input>

          <dynamic-dropdown
            api-url="/dropdown/company-types"
            label="Company Type"
            :required="true"
            name="modal_company_types[]"
            placeholder="Select Company Type(s)"
            wrapper-class="form-group"
            :multiple="true"
            :error="(errs && errs.company_types)?errs.company_types[0]:''"
            v-on:dropdown-changed="companyTypeSelected">
          </dynamic-dropdown>
        </div>
        
        <div class="col-sm-6">
          <dynamic-dropdown
            api-url="/dropdown/company-statuses"
            label="Company Status"
            :required="true"
            name="modal_company_status"
            placeholder="Select Company Status"
            wrapper-class="form-group"
            :error="(errs && errs.company_status)?errs.company_status[0]:''"
            v-on:dropdown-changed="companyStatusSelected">
          </dynamic-dropdown>

          <text-input
            wrapper-class="form-group"
            label="Office Phone"
            name="modal_office_phone"
            :required="true"
            :error="(errs && errs.office_phone)?errs.office_phone[0]:''">
          </text-input>
          <!-- <div class="form-group">
              <label class="col-lg-3 control-label">Office Phone <span class="text-danger">*</span></label>
              <div class="col-lg-9">
                <input type="text" name="modal_office_phone" placeholder="" class="form-control" >

                <div v-if="errs && errs.office_phone" class="text-danger">
                  <p>{{errs.office_phone[0]}}</p>
                </div>
              </div>
          </div> -->
        </div>
    </div>
  </form-modal>
  <!-- <div class="modal fade" id="add-new-member-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title" id="myModalLabel">Add New Member</h4>
        </div>
        <div class="modal-body">
          <div class="form-horizontal">
              <div class="row">

                  <div class="col-sm-6">
                    <div class="form-group">
                        <label class="col-lg-3 control-label">{{trans('admin.input_fields.name')}} <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                          <input type="text" name="modal_company_name" placeholder="" class="form-control" v-model="member.company_name">

                          <div v-if="errs && errs.company_name" class="text-danger">
                            <p>{{errs.company_name[0]}}</p>
                          </div>
                        </div>
                    </div>

                    <dynamic-dropdown
                      api-url="/dropdown/company-types"
                      label="Company Type"
                      :required="true"
                      name="modal_company_types[]"
                      placeholder="Select Company Type(s)"
                      wrapper-class="form-group"
                      :multiple="true"
                      :error="(errs && errs.company_types)?errs.company_types[0]:''"
                      v-on:dropdown-changed="companyTypeSelected">
                    </dynamic-dropdown>
                  </div>
                  <div class="col-sm-6">
                    <dynamic-dropdown
                      api-url="/dropdown/company-statuses"
                      label="Company Status"
                      :required="true"
                      name="modal_company_status"
                      placeholder="Select Company Status"
                      wrapper-class="form-group"
                      :error="(errs && errs.company_status)?errs.company_status[0]:''"
                      v-on:dropdown-changed="companyStatusSelected">
                    </dynamic-dropdown>

                    <div class="form-group">
                        <label class="col-lg-3 control-label">Office Phone <span class="text-danger">*</span></label>
                        <div class="col-lg-9">
                          <input type="text" name="modal_office_phone" placeholder="" class="form-control" v-model="member.office_phone">

                          <div v-if="errs && errs.office_phone" class="text-danger">
                            <p>{{errs.office_phone[0]}}</p>
                          </div>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            <button type="button" @click="addNewMember()" class="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import eventHub from '../../EventHub';
import FormModal from './FormModal.vue';
import DynamicDropdown from '../inputs/dropdowns/DynamicDropdown.vue';

import FormMixin from '../mixins/FormMixin';
import TextInput from '../inputs/Text.vue';

export default {

  mixins: [FormMixin],

  data: function(){
    return {
      member: {},
      errs: []
    }
  },

  methods: {
    getErrors: function(errors){
      this.errs = errors;
    },
    // clearForm: function(){
    //     this.member.company_name = "";
    //     this.member.company_types = "";
    //     this.member.company_status = "";
    //     this.member.office_phone = "";
    // },
    //
    // addNewMember: function(){
    //   let self = this;
    //   axios.post('company/create-instant', {
    //     'company_name' : this.member.company_name,
    //     'company_types' : this.member.company_types,
    //     'company_status' : this.member.company_status,
    //     'office_phone' : this.member.office_phone
    //   })
    //     .then(res => {
    //       //Clear form elements
    //       self.clearForm();
    //       self.$emit('new-member-created', res.data.company);
    //       $('#add-new-member-modal').modal('hide');
    //     })
    //     .catch(err => {
    //       self.errs = err.response.data;
    //     });
    // },
    //
    newMemberCreated: function(response){
      this.$emit('new-member-created', response.company);
    },

    companyTypeSelected: function(types){
      //Sync with model information
      this.member.company_types = types;
    },

    companyStatusSelected: function(status){
      //Sync with model information
      this.member.company_status = status;
    }
  },

  components: {
    'form-modal': FormModal,
    'text-input': TextInput,
    'dynamic-dropdown': DynamicDropdown,
  }
}
</script>

<style lang="css">
</style>
