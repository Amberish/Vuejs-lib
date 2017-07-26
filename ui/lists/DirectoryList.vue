<template lang="html">
  <div>

      <span v-if="listType == 'phone'">
        <p v-for="item in items">
          <i class="fa fa-phone"></i> {{item.title}} : <strong>{{item.number}}</strong>
          &nbsp;&nbsp;
          <a @click="removeItem(item)">
            <i class="fa fa-trash"></i>
          </a>
        </p>

      </span>

      <span v-if="listType == 'email'">
        <p v-for="item in items">
          <i class="fa fa-envelope"></i> {{item.title}} : {{item.email}}
          &nbsp;&nbsp;
          <a @click="removeItem(item)">
            <i class="fa fa-trash"></i>
          </a>
        </p>
      </span>
  </div>
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

    listType: {
      type: String,
      default: 'phone'
    }
  },

  data: function(){
    return {
      items: []
    }
  },

  methods: {
    removeItem: function(item){
      let self = this;
      if(this.listType == 'phone'){
        axios.post('/directory/' + this.entityType + '/' + this.entityRefId + '/remove-phone/' + item.id)
          .then(res => {
            self.items = self.items.filter(function(el){
              return el != item
            });
          })
          .catch(err => {})
      } else if(this.listType == 'email'){
        axios.post('/directory/' + this.entityType + '/' + this.entityRefId + '/remove-email/' + item.id)
          .then(res => {
            self.items = self.items.filter(function(el){
              return el != item
            });
          })
          .catch(err => {})
      }
    }
  },

  mounted: function(){
    let self = this;
    axios.get('/directory/' + this.entityType + '/' + this.entityRefId + '/' + this.listType)
      .then(res => {
        self.items = res.data.data;
      })
      .catch(err => {});

    eventHub.$on('added-new-email', function(email){
      if(self.listType == 'email')
        self.items.push(email);
    });

    eventHub.$on('added-new-phone', function(phone){
      if(self.listType == 'phone')
        self.items.push(phone);
    });
  }
}
</script>

<style lang="css">
</style>
