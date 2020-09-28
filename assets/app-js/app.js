  "use strict";
  console.warn("DPISCENTER APP");

  var API = '/ctrl_api/Api_master/index';

  // Component custom
  var Component = function Component() {
      return {
          select2 :{
            TemplatePertype:{
              formatpertypeTemplate: function pertypeTemplate(data) {
                  if (data.loading) {
                    return data.text;
                  } 
                  var $container = $(
                      "<div class='select2-result-pertype clearfix'>" +
                          "<div class='select2-result-pertype__meta'>" +
                              "<div class='text-muted small select2-result-pertype__path'></div>" +
                              "<div class='select2-result-pertype__name'></div>" +
                              "</div>" +
                          "</div>" + 
                      "</div>"
                  );

                  if(data.levels!=='0'){
                    $container.find(".select2-result-pertype__path").text(data.paths);
                    $container.find(".select2-result-pertype__name").text(data.pertype);
                  }else{
                    $container.find(".select2-result-pertype__path").text('');
                    $container.find(".select2-result-pertype__name").text(data.pertype);
                  } 
                return $container;
              },
              formatpertypeSelectionTemplate: function formatpertypeSelection(data) {
                return data.id+' / '+data.pertype;
              }
            }, 
            TemplateXxxxx:{

            }
          }
      };
  }

  // AppDpiscenter Option
  var optionAppDpiscenter = function () {
      return {
        select2Option:{
          _optionPertype: {
            ajax: {
                // url: '../assets/app-js/data/datatest.json',
                url: API,
                dataType: 'json', 
                data: function (params) {
                    var query = {
                        search: params.term, 
                    };
                    return query;
                },
                processResults: function (data) {
                    // Transforms the top-level key of the response object from 'items' to 'results'  
                    return {
                        results: data
                    };
                },
                cache: true
            }, 
            templateResult: Component().select2.TemplatePertype.formatpertypeTemplate,
            templateSelection: Component().select2.TemplatePertype.formatpertypeSelectionTemplate,
            minimumResultsForSearch: Infinity
          },
        },
        chartOption:{
          _option
        }
      };
  }

  // test anonymuse function
  var square = function(n) {
    return {
      square: n * n,
      test:n,
    };
  };
  /*
   * xxxxx
   * -----------------------
   * @type plugin
   * @usage $(".select2-pertype").xxxxx();
   */
  (function ($) {
    'use strict'; 
    $.fn.xxxxx = function () { 
      return '';
    };
  }(jQuery));

  $(document).ready(function(){
    $('.select2-pertype').select2(optionAppDpiscenter().select2Option._optionPertype);
  });
  
  