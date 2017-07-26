<template lang="html">
  <modal
    :modalId="modalId"
    :size="modalSize">
    <h4 class="modal-title" slot="heading" v-html="title"></h4>

    <form ref="form" :action="apiUrl">
      <slot></slot>
    </form>

    <span slot="footer">
      <slot name="button-left"></slot>
      <button type="button" class="btn btn-white" data-dismiss="modal">{{closeButtonText}}</button>
      <slot name="button-middle"></slot>
      <button ref="submit" type="button" class="btn btn-primary" >{{saveButtonText}}</button>
      <slot name="button-right"></slot>
    </span>
  </modal>
</template>

<script>
import Modal from './Modal.vue';
import FormMixin from '../mixins/FormMixin';

export default {

  mixins: [FormMixin],

  props: {
    modalId:{
      type: String,
    },

    apiUrl: {
      type: String,
      required: true
    },

    title: {
      type: String
    },

    form: {
      type: Object,
      default: function(){
        return {};
      }
    },

    modalSize: {
      type: String,
      default: ''
    },

    // Overriding Form Mixin async property, with default value true.
    async: {
      type: Boolean,
      default: true
    },

    saveButtonText: {
      type: String,
      default: 'Save Changes'
    },

    closeButtonText: {
      type: String,
      default: 'Close'
    }
  },

  watch: {
    errors: function(){
      this.$emit('form-errors', this.errors);
    }
  },

  methods: {

  },

  components: {
    'modal': Modal
  }
}
</script>

<style lang="css">
</style>
