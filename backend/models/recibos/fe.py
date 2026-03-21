class ReciboFeModel:

    def __init__(self, factura_id, placa, fecha_e, hora_e, 
                 cufe, subtotal, impuesto, total ) -> None:
        self.factura_id = factura_id
        self.placa = placa
        self.fecha_e = fecha_e
        self.hora_e = hora_e
        self.cufe = cufe
        self.subtotal = float(subtotal)
        self.impuesto = float(impuesto)
        self.total = float(total)
    
    
    def to_dict(self) -> dict:
        return {
            "factura_id": self.factura_id,
            "placa"     : self.placa,
            "fecha_e"   : self.fecha_e,
            "hora_e"    : self.hora_e ,
            "cufe"      : self.cufe,
            "subtotal"  : self.subtotal,
            "impuesto"  : self.impuesto,
            "total"     : self.total
            }
