import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'


// https://vitejs.dev/config
export default defineConfig({
    plugins:[
        tailwindcss()
    ],
    resolve: {
    alias: [
        {
          find: '@',
          replacement: path.resolve(path.join(__dirname, 'src'))
        },
        {
          find: 'services',
          replacement: path.resolve(path.join(__dirname, 'services'))
        }
    
    ]
  }


});
