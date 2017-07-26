<template lang="html">
  <div>
    <template v-if="type == 'plain'">
          <div :class="wrapperClass">
              <label v-if="label">
                {{label}} <span v-if="required" class="text-danger">*</span>
              </label>
              <div class="input-group date">
              <span class="input-group-addon">
                  <i class="fa fa-calendar"></i>
              </span>
                  <input ref="dateinput" type="text" :class="'form-control datepicker-plain ' + inputClass" v-model="date">
              </div>
          </div>
    </template>

    <template v-else-if="type == 'daterange'">
      <div :class="wrapperClass">
        <label v-if="label">
          {{label}} <span v-if="required" class="text-danger">*</span>
        </label>
        <div class="input-group">
            <span class="input-group-addon">
                <i class="fa fa-calendar"></i>
            </span>
            <input ref="dateinput" class="form-control datepicker-daterange" v-model="date"/>
        </div>
      </div>
    </template>

    <template v-else-if="type == 'datetime'">
      <div  class="form-group">
        <label v-if="label">
          {{label}} <span v-if="required" class="text-danger">*</span>
        </label>
        <div class="col-lg-9">
            <div class="row">
                <div class="col-md-6">
                    <div class="input-group date">
                        <span class="input-group-addon"><i class="fa fa-calendar"></i></span>
                        <input ref="dateinput" @change="dateChanged" type="text" :class="'form-control ' + inputClass" v-model="date">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="input-group clockpicker">
                        <input ref="dateinput" @change="dateChanged" type="text" :class="'form-control ' + inputClass" v-model="time">
                        <span class="input-group-addon"><i class="fa fa-clock-o"></i></span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="form-group">
        <label v-if="label">
          {{label}} <span v-if="required" class="text-danger">*</span>
        </label>
        <div class="col-lg-9">
            <div class="input-group date">
            <span class="input-group-addon">
                <i class="fa fa-calendar"></i>
            </span>
                <input @change="dateChanged" type="text" :class="'form-control ' + inputClass">
            </div>
        </div>
      </div>
    </template>
</div>

</template>

<script>
export default {
  props: {
    type: {
      type: String
    },

    wrapperClass: {
      type: String,
      default: ''
    },

    inputClass: {
      type: String,
      default: ''
    },

    label: {
      type: String,
    },

    required: {
      type: Boolean,
      default: false
    },
  },

  data: function(){
    return {
      date: "",
      time: ""
    }
  },

  methods: {
    dateChanged: function(value){
      this.$emit('date-changed', value);
    },

    dateRangeChanged: function(start, end, label){
      // Emit date change event
      this.dateChanged({
        start_date: start.format('MM/DD/Y'),
        end_date: end.format('MM/DD/Y')
      });
    },

    // Function used from parent via ref
    setDateValue: function(value){
      // Object passed for daterange picker.
      if(typeof value == 'object'){
        let picker = $(this.$refs.dateinput).data('daterangepicker');
        if(value.hasOwnProperty('startDate')){
          picker.setStartDate(value.startDate);
          $(this.$refs.dateinput).trigger('apply.daterangepicker', picker);
        }

        if(value.hasOwnProperty('endDate')){
          picker.setEndDate(value.endDate);
          $(this.$refs.dateinput).trigger('apply.daterangepicker', picker);
        }
      } else if(value == ''){
        //Trigger cancel event for daterangepicker
        $(this.$refs.dateinput).trigger("cancel.daterangepicker");

        //Trigger clearDate event for single date picker
        $(this.$refs.dateinput).trigger("clearDate");
      } else {
        //Only for single date picker.
        $(this.$refs.dateinput).datepicker('setDate', value);
      }
    },
  },

  mounted: function(){
    let self = this;
    $(document).ready(function(){
      // Datepicker
      $('.datepicker-plain').datepicker({
        autoclose: true,
        todayBtn: 'linked'
      })
      .on('changeDate', function(e, value){
        self.dateChanged($(this).val());
      })
      .on('clearDate', function(){
        $(this).val('');
      });

      // Daterange picker
      $('.datepicker-daterange').daterangepicker({
        autoApply : true,
        autoUpdateInput: false,
        "alwaysShowCalendars" : true,
        "linkedCalendars" : false,
        cancelClass : 'clear-all'
      }, self.dateRangeChanged);

      $('.datepicker-daterange').on('apply.daterangepicker', function(ev, picker) {
         $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
         //Trigger dateRangeChanged event to let parent listen
         self.dateRangeChanged(picker.startDate, picker.endDate, picker.label);
      });

      $('.datepicker-daterange').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
      });
    });
  }
}
</script>

<style lang="css">
</style>
