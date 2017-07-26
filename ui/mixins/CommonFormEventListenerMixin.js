import eventHub from '../../EventHub';

export default {
  methods: {
    // Event listeners for common AJAX forms
    // When new email added - company, contact detail page
    newEmailAdded: function(response){
      eventHub.$emit('added-new-email', response.data);
    },
    // When new phone added - company, contact detail page
    newPhoneAdded: function(response){
      eventHub.$emit('added-new-phone', response.data);
    },
    // When new attachment added - company details page
    newAttachmentAdded: function(response){
      eventHub.$emit('added-new-attachment', response.data);
    }
  }
}
