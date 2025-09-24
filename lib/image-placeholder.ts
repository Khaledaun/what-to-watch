export interface ImagePlaceholder {
  type: 'hero' | 'section' | 'movie-poster' | 'comparison' | 'infographic';
  description: string;
  altText: string;
  placement: 'top' | 'middle' | 'bottom' | 'inline';
  caption?: string;
  width?: number;
  height?: number;
}

export class ImagePlaceholderManager {
  
  static generatePlaceholderHTML(placeholder: ImagePlaceholder): string {
    const { type, description, altText, placement, caption, width = 800, height = 450 } = placeholder;
    
    // Generate appropriate placeholder based on type
    const placeholderUrl = this.getPlaceholderUrl(type, width, height);
    
    return `
      <div class="image-placeholder ${type} ${placement}" data-type="${type}" data-placement="${placement}">
        <img 
          src="${placeholderUrl}" 
          alt="${altText}" 
          width="${width}" 
          height="${height}"
          loading="lazy"
          class="placeholder-image"
        />
        ${caption ? `<p class="image-caption">${caption}</p>` : ''}
        <div class="placeholder-overlay">
          <span class="placeholder-text">${description}</span>
        </div>
      </div>
    `;
  }

  static getPlaceholderUrl(type: string, width: number, height: number): string {
    const baseUrl = 'https://via.placeholder.com';
    const color = this.getColorForType(type);
    const text = this.getTextForType(type);
    
    return `${baseUrl}/${width}x${height}/${color}/FFFFFF?text=${encodeURIComponent(text)}`;
  }

  private static getColorForType(type: string): string {
    const colors = {
      'hero': '2C3E50',
      'section': '3498DB',
      'movie-poster': 'E74C3C',
      'comparison': 'F39C12',
      'infographic': '9B59B6'
    };
    
    return colors[type as keyof typeof colors] || '95A5A6';
  }

  private static getTextForType(type: string): string {
    const texts = {
      'hero': 'Hero Image',
      'section': 'Section Image',
      'movie-poster': 'Movie Poster',
      'comparison': 'Comparison Chart',
      'infographic': 'Infographic'
    };
    
    return texts[type as keyof typeof texts] || 'Image';
  }

  static processArticleContent(content: string): string {
    // Replace image placeholders with proper HTML
    const imagePlaceholderRegex = /\[IMAGE:([^\]]+)\]/g;
    
    return content.replace(imagePlaceholderRegex, (match, placeholderData) => {
      try {
        const placeholder = JSON.parse(placeholderData);
        return this.generatePlaceholderHTML(placeholder);
      } catch (error) {
        console.error('Error parsing image placeholder:', error);
        return `<div class="image-error">Image placeholder error</div>`;
      }
    });
  }

  static validateImageRequirements(requirements: ImagePlaceholder[]): boolean {
    return requirements.every(req => 
      req.type && 
      req.description && 
      req.altText && 
      req.placement
    );
  }

  static generateImageCSS(): string {
    return `
      .image-placeholder {
        position: relative;
        margin: 20px 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .placeholder-image {
        width: 100%;
        height: auto;
        display: block;
      }
      
      .placeholder-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      .image-placeholder:hover .placeholder-overlay {
        opacity: 1;
      }
      
      .placeholder-text {
        color: white;
        font-weight: bold;
        text-align: center;
        padding: 10px;
      }
      
      .image-caption {
        margin-top: 10px;
        font-style: italic;
        color: #666;
        text-align: center;
      }
      
      .image-placeholder.hero {
        margin: 30px 0;
      }
      
      .image-placeholder.section {
        margin: 20px 0;
      }
      
      .image-placeholder.movie-poster {
        max-width: 300px;
        margin: 15px auto;
      }
      
      .image-placeholder.comparison {
        margin: 25px 0;
      }
      
      .image-placeholder.infographic {
        margin: 30px 0;
      }
    `;
  }
}

