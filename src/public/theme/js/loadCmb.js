
        const cmbKeys = {
            selectPlan: {
                keyDataId: 'id_plan',
                keyDataValue: 'plan',
                keyDataIdCompare: '',
                keyHtml: '#select_plan',
                url: '/consultar-plan?id_plan_gral='
            },
            selectLinea: {
                keyDataId: 'id_linea',
                keyDataValue: 'linea_accion',
                keyDataIdCompare: '',
                keyHtml: '#select_linea',
                url: '/consultar-lineas-accion_x_plan_general?id_plan_gral='
            },
            selectObjetivo: {
                keyDataId: 'id_objetivo',
                keyDataValue: 'objetivo',
                keyDataIdCompare: '',
                keyHtml: '#select_objetivo',
                url: '/consultar-objetivo-x-lineas-accion/?id_linea_accion='
            },
            selectEstrategia: {
                keyDataId: 'id_estrategia',
                keyDataValue: 'estrategia',
                keyDataIdCompare: '',
                keyHtml: '#select_estrategia',
                url: '/consultar-estrategia-x-objetivo/?id_objetivo='
            },
            selectPlanAccion: {
                keyDataId: 'id_plan',
                keyDataValue: 'plan',
                keyDataIdCompare: '',
                keyHtml: '#select_plan_accion',
                url: '/consultar-plan-accion-x-estrategia/?id_estrategia='
            },
            selectArea: {
                keyDataId: 'id_area',
                keyDataValue: 'nombre_area',
                keyDataIdCompare: '',
                keyHtml: '#select_area',
                url: '/consultar-areaxid/?id_area='
            }
        }
    
        

    
    
    function loadCustomSelect(url, key) {
        $(key.keyHtml).html("");
        $.ajax({
            type: 'get',
            url,
            data: [],
            contentType: false,
            cache: false,
            processData: false,
            success: function (result) {
                if(result.length == 0){
                    $(key.keyHtml).append('<option value="0" selected="selected">' + 'No hay opciones disponibles' + '</option>');
                }else{
                    $(key.keyHtml).append('<option value="0" selected="selected">' + 'Escoge alguna opción ...' + '</option>');
                }
                result.forEach(element => {
                    if (element[key.keyDataId] == key.keyDataIdCompare) {
                        $(key.keyHtml).append('<option value=' + element[key.keyDataId] + ' selected="selected">' + element[key.keyDataValue] + '</option>');
                    } else {
                        $(key.keyHtml).append('<option value=' + element[key.keyDataId] + '>' + element[key.keyDataValue] + '</option>');
                    }
                });
            }
        });
    }
