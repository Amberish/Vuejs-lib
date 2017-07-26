<template lang="html">
  <div class="modal spicymodal fade" :id="modalId" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
      <div class="modal-dialog" :class="(size)?'modal-' + size:''" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <slot name="heading"></slot>
              </div>
              <div class="modal-body">
                <slot></slot>
              </div>
              <div class="modal-footer">
                  <slot name="footer"></slot>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  props: {
    modalId: {
      type: String,
      required: true
    },

    heading: {
    },

    body: {
    },

    footer: {
    },

    size: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="css">
</style>
