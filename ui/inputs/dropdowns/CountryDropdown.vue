<template>
  <select :name="name" data-placeholder="Select Country">
      <option value=""></option>
      <option v-for="country in countries" v-bind:value="country.id" v-bind:selected="(selected == country.id)?true:false">
        {{country.nicename}}
      </option>
  </select>
</template>

<script>
    // import axios from 'axios';
    export default {
        props: {
          selected:{
            type: [String, Object]
          },
          name: {
            type:String,
            default:'country'
          }
        },
        data: function() {
          return {
            countries: []
          }
        },
        created: function() {
          axios.get(`/countries`)
            .then(response => {
              this.countries = response.data.data;

              setTimeout(function () {
                $(self.$el).trigger('change');
              }, 30);
            })
            .catch(e => {
              this.errors.push(e)
            })
        }
    }
</script>
