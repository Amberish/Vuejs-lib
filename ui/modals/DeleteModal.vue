<template lang="html">
  <modal
    :modalId="modalId">
    <h4 class="modal-title" slot="heading">
      Delete {{item.charAt(0).toUpperCase() + item.substr(1).toLowerCase()}}
    </h4>

    <p>
      Are you sure you want to delete this {{item}} ?
    </p>

    <span slot="footer">
      <form method="post" :action="action">
        <input type="hidden" name="_method" value="DELETE">
        <input ref="token" type="hidden" name="_token" :value="Laravel.csrfToken">
        <button type="button" class="btn btn-default" data-dismiss="modal">No</button>
        <button type="submit" class="btn btn-primary">Yes</button>
      </form>
    </span>
  </modal>
</template>

<script>
import Modal from './Modal.vue';
export default {
  props: {
    modalId: {
      type: String,
      required: true
    },

    action: {
      type: String,
      required: true
    },

    item: {
      type: String,
      required: true
    }
  },

  data: function(){
    return {
      Laravel: global.Laravel
    }
  },

  components: {
    modal: Modal
  }
}
</script>

<style lang="css">
</style>
