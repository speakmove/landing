1) href={`/#how-it-works`} почему тут без айди?

2) const isExternal = (href: string): boolean => {
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:');
}; - это лучше в общую утилиту , чтобы везде можно было бы использовать

3) не должно быть никаких style 
