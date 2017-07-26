<template lang="html">
  <ul class="list-unstyled project-files">
      <li v-for="attachment in attachments">
        <a :href="'/' + attachment.path + '/' + attachment.filename">
          <i class="fa fa-file"></i> {{attachment.filename.substr(attachment.filename.indexOf('__') + 2)}}
        </a>
        <a @click="removeItem(attachment)">
          <i class="fa fa-trash"></i>
        </a>
      </li>
  </ul>
</template>

<script>
import eventHub from '../../EventHub';
export default {
  props: {
    entityType: {
      type: String,
      required: true
    },

    entityRefId: {
      type: Number,
      required: true
    },
  },

  data: function(){
    return {
      attachments: []
    }
  },

  methods: {
    removeItem: function(attachment){
      let self = this;
      axios.post('/attachment/' + this.entityType + '/' + this.entityRefId + '/delete/' + attachment.id)
        .then(res => {
          self.attachments = self.attachments.filter(function(el){
            return el != attachment
          });
        })
        .catch(err => {})
    }
  },

  mounted: function(){
    let self = this;
    axios.get('/attachment/' + this.entityType + '/' + this.entityRefId)
      .then(res => {
        self.attachments = res.data.data;
      })
      .catch(err => {});

    eventHub.$on('added-new-attachment', function(attachments){
      for (var i = 0; i < attachments.length; i++) {
        self.attachments.push(attachments[i]);
      }
    });

    // eventHub.$on('added-new-phone', function(phone){
    //   if(self.listType == 'phone')
    //     self.items.push(phone);
    // });
  }
}
</script>

<style lang="css">
</style>
