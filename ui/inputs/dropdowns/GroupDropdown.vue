<template>
  <select name="group[]" ref="select2" class="group-select2 form-control" multiple="" tabindex="-1" aria-hidden="true">
    <option
      v-for="group in groups"
      v-bind:value="group.id"
      v-bind:selected="(selectedArray.indexOf(group.id.toString()) > -1 )?true:false">
      {{group.display_name}}
    </option>
  </select>
</template>

<style media="screen">
/**
 * Need to set z-index higher so select2 dropdown is visible at modal
 */
.select2-container.select2-container--default.select2-container--open  {
  z-index: 5000;
}
</style>

<script>
    export default {
        props: ['selected'],
        data: function() {
          return {
            groups: [],
            select2El: {}
          }
        },

        computed: {
          selectedArray: function(){
            return (this.selected != 'null')?JSON.parse(this.selected):[];
          }
        },

        methods: {
          groupSelected: function(event){
            let select_data = event.params.data;
            let selected_option_text = select_data.text.trim().toLowerCase();

            if(selected_option_text == 'admin'){
              //If selected option is admin
              //Disable other options
              this.select2El.find('option').each(function(index, option){
                if(option.innerText.trim().toLowerCase() != 'admin'){
                  option.disabled = true;
                }
              });

            } else {
              //If unselected option is other than admin
              //Disable other options
              this.select2El.find('option').each(function(index, option){
                if(option.innerText.trim().toLowerCase() == 'admin'){
                  option.disabled = true;
                }
              });
            }

            //reload selec2 to reflect changes
            this.select2El.select2();
          },

          groupUnselected: function(event) {
            let unselect_data = event.params.data;
            let unselected_option_text = unselect_data.text.trim().toLowerCase();

            if(unselected_option_text == 'admin'){
              //If unselected option is admin
              //Disable other options
              this.select2El.find('option').each(function(index, option){
                if(option.innerText.trim().toLowerCase() != 'admin')
                  option.disabled = false;
              });

            } else {
              //If unselected option is other than admin
              //1. Check if any other item is selected, if yes then don't enable admin
              //2. If no other ooption selected enable admin
              let selected = [];
              this.select2El.find('option').each(function(index, option){
                if(option.selected)
                  selected.push(option.innerText.trim().toLowerCase());
              });

              if(selected.length == 0){
                this.select2El.find('option').each(function(index, option){
                  if(option.innerText.trim().toLowerCase() == 'admin'){
                    option.disabled = false;
                  }
                });
              }
            }

            //reload selec2 to reflect changes
            this.select2El.select2();
          },

          configureSelect2OnOpen: function(){
            if(this.selectedArray.length > 0 ){
              let self = this;
              if(this.selectedArray.indexOf("1") > -1){
                let index = this.selectedArray.indexOf("1");
                this.selectedArray.splice(index, 1);
                this.select2El.find('option').each(function(index, option){
                  if(option.innerText.trim().toLowerCase() != 'admin'){
                    option.disabled = true;
                  }
                });
              } else {
                this.select2El.find('option').each(function(index, option){
                  if(option.innerText.trim().toLowerCase() == 'admin'){
                    option.disabled = true;
                  }
                });
              }
            }
          }
        },

        created: function() {
          // this.$refs.select2.select2();
          //Emitting value initially
          this.$emit('group', this.selected);

          axios.get(`/groups`)
            .then(response => {
              this.groups = response.data.data;
            })
            .catch(e => {
              this.errors.push(e)
            })
        },

        mounted: function(){
          let self = this;
          this.select2El = $('.group-select2');
          // Applying changes on document load,
          // after select2 library loaded.
          $(document).ready(function(){
            self.select2El.select2();
          });

          //Bind event listeners for select 2
          this.select2El.on('select2:select', this.groupSelected);
          this.select2El.on('select2:unselect', this.groupUnselected);

          //Configure select 2 for selectedArray
          this.select2El.on('select2:open', this.configureSelect2OnOpen)
        }
    }
</script>
