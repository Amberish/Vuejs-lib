<template>
  <table class="table table-striped permissions">
      <thead>
      <tr>
          <th></th>
          <th>{{trans('admin.table_columns.read')}}</th>
          <th>{{trans('admin.table_columns.write')}}</th>
          <th>{{trans('admin.table_columns.modify')}}</th>
          <th>{{trans('admin.table_columns.own_record')}}</th>
          <th>{{trans('admin.table_columns.all_record')}}</th>
          <th>{{trans('admin.table_columns.all_group')}}</th>
          <th>{{trans('admin.table_columns.full_access')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!isReadOnly">
          <td>All Modules</td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('read', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('write', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('modify', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('own-record', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('all-record', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('all-group', $event)"></td>
          <td><input type="checkbox" :disabled="isReadOnly" @click="checkAllModules('full-access', $event)"></td>
      </tr>
      <tr>
          <td>Customer</td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['read'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['read'].id) >= 0"
            @click="permissionChecked('customer', 'read', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['write'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['write'].id) >= 0"
            @click="permissionChecked('customer', 'write', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['modify'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['modify'].id) >= 0"
            @click="permissionChecked('customer', 'modify', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['own-record'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['own-record'].id) >= 0"
            @click="permissionChecked('customer', 'own-record', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['all-record'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['all-record'].id) >= 0"
            @click="permissionChecked('customer', 'all-record', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['all-group'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['all-group'].id) >= 0"
            @click="permissionChecked('customer', 'all-group', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.customer['full-access'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.customer['full-access'].id) >= 0"
            @click="fullAccessChecked('customer', $event)"></td>
      </tr>
      <tr>
          <td>Order</td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['read'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['read'].id) >= 0"
            @click="permissionChecked('order', 'read', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['write'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['write'].id) >= 0"
            @click="permissionChecked('order', 'write', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['modify'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['modify'].id) >= 0"
            @click="permissionChecked('order', 'modify', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['own-record'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['own-record'].id) >= 0"
            @click="permissionChecked('order', 'own-record', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['all-record'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['all-record'].id) >= 0"
            @click="permissionChecked('order', 'all-record', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['all-group'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['all-group'].id) >= 0"
            @click="permissionChecked('order', 'all-group', $event)"></td>
          <td><input type="checkbox"
            name="permissions[]"
            :disabled="isReadOnly"
            v-bind:value="permissionsJson.order['full-access'].id"
            v-bind:checked="permission_checked.indexOf(permissionsJson.order['full-access'].id) >= 0"
            @click="fullAccessChecked('order', $event)"></td>
      </tr>
      </tbody>
  </table>
</template>

<script>
    export default {
        props: {
          permissions: {
            type : [Array, Object, String]
          },

          permissionsSelected: {
            type : [Array, String]
          },

          isReadOnly: {
            type : Boolean,
            default : false
          }
        },

        watch: {
          permissionsSelectedJson: function(val){
            this.permission_checked = this.permissionsSelectedJson.map(function (val) {
                return parseInt(val);
            });
          }
        },

        data: function() {
          return {
            permission_checked: [],
            module_types: ['customer', 'order'],
            access_types: ['read', 'write', 'modify', 'own-record', 'all-record', 'all-group', 'full-access']
          }
        },

        computed: {
          permissionsJson: function(){
            if(typeof this.permissions == 'object'){
              return this.permissions
            }

            return JSON.parse(this.permissions);
          },
          permissionsSelectedJson: function(){
            if(typeof this.permissionsSelected == 'object'){
              return this.permissionsSelected
            }

            return JSON.parse(this.permissionsSelected);
          }
        },

        methods: {
          permissionChecked: function(module_name, permission_name, event){
            if(!event.currentTarget.checked){
              //Remove selected permission from permission_checked array
              var index = this.permission_checked.indexOf(this.permissionsJson[module_name][permission_name].id);
              if( index >= 0)
                this.permission_checked.splice(index, 1);

              //If module's full access is enabled, then disable it
              var index_full_access = this.permission_checked.indexOf(this.permissionsJson[module_name]['full-access'].id);
              if(index_full_access >= 0)
                this.permission_checked.splice(index_full_access, 1);
            } else {
              //Add selected permission to permission_checked array
              if( this.permission_checked.indexOf(this.permissionsJson[module_name][permission_name].id) == -1)
                this.permission_checked.push(this.permissionsJson[module_name][permission_name].id);
            }

            this.$emit('permission', this.permission_checked);
          },

          fullAccessChecked: function(module_name, event){
            //If checked then added permissions to permission_checked
            if(event.currentTarget.checked){
              if(this.permission_checked.indexOf(this.permissionsJson[module_name]['full-access'].id) == -1)
                this.permission_checked.push(this.permissionsJson[module_name]['full-access'].id);

              for(var i=0; i< this.access_types.length; i++){
                if(this.permission_checked.indexOf(this.permissionsJson[module_name][this.access_types[i]].id) == -1)
                  this.permission_checked.push(this.permissionsJson[module_name][this.access_types[i]].id);
              }
            } else {
              var index_full_access = this.permission_checked.indexOf(this.permissionsJson[module_name]['full-access'].id);
              if( index_full_access >= 0)
                this.permission_checked.splice(index_full_access, 1);
              //If un-checked then remove permissions from permission_checked
              for(var i=0; i< this.access_types.length; i++){
                var index = this.permission_checked.indexOf(this.permissionsJson[module_name][this.access_types[i]].id);
                if(index >= 0){
                  this.permission_checked.splice(index, 1);
                }
              }
            }
          },

          checkAllModules: function(permission_type, event){
            if(event.currentTarget.checked){
              for(var i=0; i< this.module_types.length; i++){
                if(this.permission_checked.indexOf(this.permissionsJson[this.module_types[i]][permission_type].id) == -1)
                  this.permission_checked.push(this.permissionsJson[this.module_types[i]][permission_type].id);
              }

            } else {
              for(var i=0; i< this.module_types.length; i++){
                var index = this.permission_checked.indexOf(this.permissionsJson[this.module_types[i]][permission_type].id);
                if(index >= 0){
                  this.permission_checked.splice(index, 1);
                }
              }
            }
          }
        },

        mounted() {
          this.permission_checked = this.permissionsSelectedJson.map(function (val) {
              return parseInt(val);
          });
       }
    }
</script>
