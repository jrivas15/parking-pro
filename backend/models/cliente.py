from global_utils.data.data_fe import tipo_persona_code, tipo_doc_code, tributos
import json

class Cliente():
    def __init__(self, tipo_persona='NATURAL', razon_social = '', telefono = '', city_code = '', city = '', depto = '', depto_code = '', 
                 direccion = '' , n_doc = '',t_doc = 'Cédula de ciudadanía', dv = '', 
                 email = '', responsabilidades = 'R-99-PN', tributo = 'No aplica') -> None:
        self.additional_account_ID = tipo_persona_code[tipo_persona] # 1: JURIDICA 2: NATURAL
        self.tipo_persona = tipo_persona
        self.name = razon_social
        self.telefono = telefono
        self.city_code = city_code
        self.city = city
        self.departamento = depto
        self.departamento_code = depto_code
        self.address = direccion
        self.id = n_doc
        self.t_doc = t_doc
        self.id_code = tipo_doc_code[t_doc]
        self.dv = dv
        self.email = email
        self.tax_sheme_id = tributos[tributo] #Responsabilidades fiscales ZZ CONSUMIDOR FINAL
        self.tax_sheme_name = tributo
        self.tax_level_code = responsabilidades

    def cliente_from_db(self, data:list):
        self.additional_account_ID = tipo_persona_code[data[2]] # 1: JURIDICA 2: NATURAL
        self.name = data[1]
        self.telefono = data[6]
        self.city_code = data[12]
        self.city = data[11]
        self.departamento = data[9]
        self.departamento_code = data[10]
        self.address = data[7]
        self.id = data[4]
        self.t_doc = data[3]
        self.id_code = tipo_doc_code[data[3]]
        self.dv = data[5]
        self.email = data[13]
        self.tax_sheme_id = tributos[data[14]] #Responsabilidades fiscales ZZ CONSUMIDOR FINAL
        self.tax_sheme_name = data[14]
        self.tax_level_code = data[15]
    
    @staticmethod
    def cliente_from_data(data:list):
        return Cliente(data[2],data[1],data[6],data[12],data[11],data[9],data[10],
                       data[7],data[4],data[3],data[5],data[13],data[15],data[14])
        
    def to_json_str(self) ->str:
        return json.dumps({
            'tipo_persona':self.tipo_persona, 
            'razon_social' : self.name, 
            'telefono' : self.telefono, 
            'city_code' : self.city_code, 
            'city' : self.city, 
            'depto' : self.departamento, 
            'depto_code' : self.departamento_code, 
            'direccion' : self.address, 
            'n_doc' : self.id,
            't_doc' : self.t_doc, 
            'dv' : self.dv, 
            'email' : self.email, 
            'responsabilidades' : self.tax_level_code, 
            'tributo' : self.tax_sheme_name
        })
        
    @staticmethod
    def cliente_from_json(data_dict:dict):
        print(data_dict)
        #*OBLIGATORIOS
        tipo_persona = data_dict['tipo_persona']
        razon_social = data_dict['razon_social']
        email = data_dict['email']
        t_doc = data_dict['t_doc']
        n_doc = data_dict['n_doc']
        dv = data_dict['dv']
        try:
            telefono = data_dict['telefono']
            city_code = data_dict['city_code']
            city = data_dict['city']
            depto = data_dict['depto']
            depto_code = data_dict['depto_code']
            direccion = data_dict['direccion'] 
            tributo = data_dict['tributo']
            responsabilidades = data_dict['responsabilidades']
            return Cliente(tipo_persona,razon_social, telefono, city_code, city,depto, depto_code, direccion,
                       n_doc, t_doc, dv,email, responsabilidades, tributo)
        except:
            return Cliente(tipo_persona=tipo_persona, razon_social=razon_social, 
                           email=email, t_doc=t_doc, n_doc=n_doc, dv=dv )
    
    def to_dict(self) -> dict:
        return{
            'tipo_persona':self.tipo_persona, 
            'razon_social' : self.name, 
            'telefono' : self.telefono, 
            'city_code' : self.city_code, 
            'city' : self.city, 
            'depto' : self.departamento, 
            'depto_code' : self.departamento_code, 
            'direccion' : self.address, 
            'n_doc' : self.id,
            't_doc' : self.t_doc, 
            'dv' : self.dv, 
            'email' : self.email, 
            'responsabilidades' : self.tax_level_code, 
            'tributo' : self.tax_sheme_name
        }

    @staticmethod
    def cliente_to_dict(cliente):
        return{
            'tipo_persona':cliente.tipo_persona, 
            'razon_social' : cliente.name, 
            'telefono' : cliente.telefono, 
            'city_code' : cliente.city_code, 
            'city' : cliente.city, 
            'depto' : cliente.departamento, 
            'depto_code' : cliente.departamento_code, 
            'direccion' : cliente.address, 
            'n_doc' : cliente.id,
            't_doc' : cliente.t_doc, 
            'dv' : cliente.dv, 
            'email' : cliente.email, 
            'responsabilidades' : cliente.tax_level_code, 
            'tributo' : cliente.tax_sheme_name
        }