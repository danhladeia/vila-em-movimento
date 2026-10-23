// Colisão simples no plano XZ: caixas (prédios, bancos) e círculos (árvores, pessoas).
// O personagem é um círculo; ao encostar, é empurrado para fora e "desliza" pela borda.
export class Colisao {
  constructor(limite) {
    this.caixas = [];
    this.circulos = [];
    this.limite = limite; // metade do lado do mundo jogável
  }

  caixa(x, z, largura, profundidade, dono = null) {
    const c = { minX: x - largura / 2, maxX: x + largura / 2, minZ: z - profundidade / 2, maxZ: z + profundidade / 2, dono, ativo: true };
    this.caixas.push(c);
    return c;
  }

  circulo(x, z, raio, dono = null) {
    const c = { x, z, raio, dono, ativo: true };
    this.circulos.push(c);
    return c;
  }

  // Corrige `pos` (Vector3) para um círculo de raio `r`. `ignorar` = dono a desconsiderar (o próprio corpo).
  // Devolve true se houve contato.
  resolver(pos, r, ignorar = null) {
    let tocou = false;
    for (const c of this.caixas) {
      if (!c.ativo || c.dono === ignorar) continue;
      const px = Math.max(c.minX, Math.min(pos.x, c.maxX));
      const pz = Math.max(c.minZ, Math.min(pos.z, c.maxZ));
      let dx = pos.x - px;
      let dz = pos.z - pz;
      const d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;
      tocou = true;
      if (d2 > 1e-8) {
        const d = Math.sqrt(d2);
        pos.x = px + (dx / d) * r;
        pos.z = pz + (dz / d) * r;
      } else {
        // Centro dentro da caixa: sai pelo lado mais próximo.
        const saidas = [pos.x - c.minX, c.maxX - pos.x, pos.z - c.minZ, c.maxZ - pos.z];
        const i = saidas.indexOf(Math.min(...saidas));
        if (i === 0) pos.x = c.minX - r;
        else if (i === 1) pos.x = c.maxX + r;
        else if (i === 2) pos.z = c.minZ - r;
        else pos.z = c.maxZ + r;
      }
    }
    for (const c of this.circulos) {
      if (!c.ativo || c.dono === ignorar) continue;
      const dx = pos.x - c.x;
      const dz = pos.z - c.z;
      const min = r + c.raio;
      const d2 = dx * dx + dz * dz;
      if (d2 >= min * min || d2 < 1e-8) continue;
      tocou = true;
      const d = Math.sqrt(d2);
      pos.x = c.x + (dx / d) * min;
      pos.z = c.z + (dz / d) * min;
    }
    const L = this.limite - r;
    if (Math.abs(pos.x) > L || Math.abs(pos.z) > L) {
      pos.x = Math.max(-L, Math.min(L, pos.x));
      pos.z = Math.max(-L, Math.min(L, pos.z));
      tocou = true;
    }
    return tocou;
  }
}
