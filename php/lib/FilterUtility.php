<?php

//namespace App\Http\Utilities; //Provide proper namespace
use App\Http\Controllers\Controller;
use Carbon\Carbon;

class FilterUtility {

    public static function resolveColumnName($column_name, $filter_type = 'searching'){
      if(gettype($column_name) == 'array')
        $column_name = $column_name[$filter_type];

      return $column_name;
    }

    /**
     * Helper to return where clause applied to given date.
     * @param  [collection] $collection   - Eloquent or Query builder Collection
     * @param  [string|array] $date       - date to be passed
     * @param  [string] $column_name      [description]
     * @return [collection]               [description]
     */
    public static  function date($collection, $date, $column_name){
      $column_name = self::resolveColumnName($column_name);

      if($date == '' || $date == null)
        return $collection;

      if(gettype($date) == 'array'){
        $collection->where(function($query) use ($date, $column_name){
          $query->where($column_name, '>=', Carbon::parse($date['start_date']));
          $query->where($column_name, '<', Carbon::parse($date['end_date'])->addDays(1));
        });
      } else if(gettype($date) == 'string'){
        $collection->where(function($query) use ($date, $column_name){
          $query->where($column_name, '>=', Carbon::parse($date));
        });
      }

      return $collection;
    }

    /**
     * Helper to return where clause applied to given text.
     * @param  [collection] $collection  - Eloquent or Query builder Collection
     * @param  [string] $text            -text to be searched
     * @param  [string] $column_name     [description]
     * @return [collection]              [description]
     */
    public static function text($collection, $text, $column_name){
      $column_name = self::resolveColumnName($column_name);

      if($text == '' || $text == null)
        return $collection;

      return $collection->where($column_name, 'LIKE', "%$text%");
    }

    /**
     * Helper to return where clause applied to given search.
     * Matches exact search. Useful for particular id search.
     * @param  [collection] $collection   - Eloquent or Query builder Collection
     * @param  [string] $value        -value to be searched
     * @param  [string] $column_name [description]
     * @return [collection]              [description]
     */
    public static function searchExact($collection, $value, $column_name){
      $column_name = self::resolveColumnName($column_name);

      if($value == '' || $value == null)
        return $collection;

      return $collection->where($column_name, '=', "$value");
    }

    /**
     * Helper to return sorted collection for given item.
     * @param  [collection] $collection  - Eloquent or Query builder Collection
     * @param  [string] $column_name     - Column name
     * @param  [string] $order_type      - order type 'asc' or 'desc'
     * @return [collection]              [description]
     */
    public static function sort($collection, $column_name, $order_type){
      $column_name = self::resolveColumnName($column_name, 'sorting');

      return $collection->orderBy($column_name, $order_type);
    }

    /**
     * Search Array Values comparison (where in)
     * @param  [collection] $collection     - Eloquent or Query builder Collection
     * @param  [string] $array_values   - Array Values
     * @param  [string] $column_name    [description]
     * @return [collection]                 [description]
     */
    public static function arraySearch($collection, $array_values, $column_name){
      $column_name = self::resolveColumnName($column_name);

      if(count($array_values) > 0){
        $filtered_array = array_where($array_values, function ($value) {
            return $value != '';
        });
        return $collection->whereIn($column_name, $filtered_array);
      }
    }

    /**
     * Function to convert [type => [field => column], ..] to [field => column, ..]
     * @param  [type] $type_field_column [description]
     * @return [type]                    [description]
     */
    public static function fieldColumnMap($type_field_column){
      $field_column_map = [];
      foreach ($type_field_column as $type => $fields) {
        foreach ($fields as $field_name => $column) {
          $field_column_map[$field_name] = $column;
        }
      }
      return $field_column_map;
    }

    /**
     * A comprihensive function to apply filters as per the input provided.
     * @param  [collection] $collection         - Eloquent or Query builder Collection
     * @param  [request] $input                 - Filter API Request
     * @param  [array] $type_field_columns      - All fields categorized based on their type.[dates, text, array_search, search_exact]
     * @return [collection]                     [description]
     */
    public static function filterRecords($collection, $request, $type_field_columns){
      //Getting field and column mapping
      $field_db_columns = self::fieldColumnMap($type_field_columns);

      // Sort records
      if($request->get('sort') != '' && $request->get('sort_order') != ''){
        self::sort($collection, $field_db_columns[$request->get('sort')], $request->get('sort_order'));
      }

      // Loop through type_field_columns and apply conditions for fields.
      foreach ($type_field_columns as $type => $fields) {
        switch ($type) {
          case 'date':
            foreach ($fields as $field_name => $column_name) {
              // All Date
              self::date($collection, $request->get($field_name), $column_name);
            }
            break;

          case 'text':
            foreach ($fields as $field_name => $column_name) {
              //All text search
              self::text($collection, $request->get($field_name), $column_name);
            }
            break;

          case 'array_search':
            foreach ($fields as $field_name => $column_name) {
              //All text search
              self::arraySearch($collection, $request->get($field_name), $column_name);
            }
            break;

          case 'search_exact':
            foreach ($fields as $field_name => $column_name) {
              //All text search
              self::searchExact($collection, $request->get($field_name), $column_name);
            }
            break;

          default:
            # code...
            break;
        }
      }

      return $collection;
    }
}
