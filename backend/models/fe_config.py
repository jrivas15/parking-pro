

class FEConfig:
    def __init__(self, configs:tuple) -> None:
        #* SOFTWARE
        self.ambiente = configs[0]
        self.software_id = configs[1]
        self.software_pin = configs[2]
        self.clave_tecnica = configs[3]
        #* resolución 
        self.n_resolucion = configs[4]
        self.n_actual = configs[5]
        self.prefijo = configs[6]
        self.fecha1_res = configs[7]
        self.fecha2_res = configs[8]
        self.rango1_res = configs[9]
        self.rango2_res = configs[10]
        #* EMISOR
        self.razon_social = configs[11]
        self.tipo_persona = configs[12]
        self.t_doc= configs[13]
        self.n_doc= configs[14]
        self.dv= configs[15]
        self.direccion = configs[16]
        self.cod_postal = configs[17]
        self.depto = configs[18]
        self.cod_dpto= configs[19]
        self.municipio = configs[20]
        self.cod_municipio = configs[21]
        self.dir_fiscal = configs[22]
        self.cod_postal_fiscal = configs[23]
        self.depto_fiscal = configs[24]
        self.cod_depto_fiscal= configs[25]
        self.municipio_fiscal = configs[26]
        self.cod_municipio_fiscal = configs[27]
        self.email = configs[28]
        self.responsabilidades = configs[29]
        #tax scheme
        self.tributo = configs[30]
        #certificado
        self.passwd_cert = configs[31]
        self.hab_fac     = configs[32]

