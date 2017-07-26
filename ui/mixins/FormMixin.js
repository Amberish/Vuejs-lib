/**
 * This mixin is planned to be used throughout the system for form submission.
 * Just add this mixin to the form page, add ref="form" on the form tag, and ref="submit" on submit button.
 * Pass other information as usual. Form will submit the information on the action provided.
 *
 * There are two ways of submission: sync and async. By default it will do synchronous type submission.
 * It will post form async but expect url in response. If url is sent in response it will redirect to given url.
 * It feels like synchronous submission.
 *
 * For async form submission, just redefine prop 'async' with default true.(See FormModal for example.)
 * It will submit to given action asynchronously and emit event 'form-submit-response' with the response data.
 * One can subscribe this event and perform other actions based on it.
 */
export default {
  props: {
    // Asynchronous submission of form
    async: {
      type: Boolean,
      default: false
    }
  },

  data: function(){
    return {
      errors: {},
      formResponse: '',
      formInitialState: []
    };
  },

  methods: {
    // Debouncing form submition to avoid multiple click submit
    submitAsyncForm: _.debounce(function(event){
      event.preventDefault();
      let self = this;
      let form = this.$refs.form;
      let submit_button = this.$refs.submit;
      let submit_html = $(submit_button).html();

      // Button text to be replaced with spinner.
       $(submit_button).html('<i class="fa fa-circle-o-notch fa-spin"></i>')
      axios.post($(form).attr('action'), this.formatFormData(form))
        .then(res => {
          // Get back button content.
          $(submit_button).html(submit_html);

          if(!self.async){
            //Redirect to the url returned by api.
            //Flash need to be set inside api for toast notification.
            global.location = res.data.url;
          } else {
            //Clear form data
            self.resetAsyncFormData(form);

            // Close modal
            if(self.modalId != undefined)
              $('#' + self.modalId).modal('hide');

            if(res.data.message != undefined)
              toastr.success(res.data.message);

            // Emit event to let parent subscribe.
            self.$emit('form-submit-response', res.data);
          }
        })
        .catch(err => {
          // Get back button content.
          $(submit_button).html(submit_html);

          self.errors = err.response.data;
          toastr.error('Errors! Request failed.');
        });
    }, 500),

    // Function responsible for formating form data, to be passed down th API.
    formatFormData: function(form_el){
      let form_data = new FormData();
      this.formatTextData(form_data, form_el);
      this.formatFileData(form_data, form_el);
      return form_data;
    },

    // Function responsible for collecting all text inputs.
    formatTextData: function(form_data, form_el){
      let self = this;
      let serialized_data = $(form_el).serializeArray();
      _.forEach(serialized_data, function(obj){
        form_data.append(self.stripModalPrefixFromFieldName(obj.name), obj.value);
      });

      return form_data;
    },

    // Function responsible for collecting all file inputs.
    formatFileData: function(form_data, form_el){
      // All file items; eg attachments[], logo, avatar etc.
      // These items itself can have multiple files.
      let all_file_items = $(form_el).find('input[type="file"]');
      let self = this;
      _.forEach(all_file_items, function(item){
        let files = item.files;
        for (var i = 0; i < files.length; i++) {
          form_data.append(self.stripModalPrefixFromFieldName(item.name), files[i]);
        }
      });

      return form_data;
    },

    stripModalPrefixFromFieldName: function(field){
      let prefix = 'modal_';
      if(field.indexOf(prefix) != -1)
        return field.substr(field.indexOf(prefix) + prefix.length);
      else
        return field;
    },

    // Used for async forms: Function responsible for collecting initial state of form.
    storeFormInitialState: function(form){
      let _form_initial_state = [];
      // Getting input type data
      _.map($(form).find('input'), function(input){
        let $input = $(input);
        _form_initial_state.push({
          'tag': 'input',
          'type': $input.attr('type'),
          'name': $input.attr('name'),
          'value': $input.val()
        });
      });

      // Getting select data
      _.map($(form).find('select'), function(select){
        let $select = $(select);
        _form_initial_state.push({
          'tag': 'select',
          'name': $select.attr('name'),
          'value': $select.val()
        });
      });

      this.formInitialState = _form_initial_state;
    },

    // Used for async forms: Getting form inital state
    getFormInitialState: function(){
      return this.formInitialState;
    },

    // Used for async forms: Resetting async form to initial state.
    resetAsyncFormData: function(form){
      let _form_initial_state = this.getFormInitialState();
      _.forEach(_form_initial_state, function(el){
        if(el.tag == 'input'){
          $(form).find('input[name="' + el.name + '"]').val(el.value);
        } else if(el.tag == 'select'){
          $(form).find('select[name="' + el.name + '"]').val(el.value);
        }
      });
    },

    // Mapping errors to local errors
    mapFormErrors: function(errors){
      this.errors = errors;
    },

    // Mapping errors to local errors for modal inputs
    mapModalFormErrors: function(errors){
      let self = this;
      this.errors = {};
      _.forEach(errors, function(error, key){
        self.errors['modal_' + key] = error;
      });
    }
  },

  mounted: function(){
    // Binding submitForm function to submit button
    $(this.$refs.submit).bind('click', this.submitAsyncForm);

    // Storing inital state of form.
    this.storeFormInitialState(this.$refs.form);
  }
}
