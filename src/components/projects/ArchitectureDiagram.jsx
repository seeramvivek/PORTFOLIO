import { Fragment } from 'react';
import { LuArrowDown } from 'react-icons/lu';
import TechIcon from '../ui/TechIcon.jsx';

// Layered architecture diagram: layers top to bottom, with labelled flows between them.
export default function ArchitectureDiagram({ architecture, name }) {
  const { layers, flows } = architecture;
  return (
    <figure className="arch" aria-label={`${name} architecture diagram`}>
      {layers.map((layer, i) => (
        <Fragment key={layer.name}>
          <div className="arch-layer">
            <p className="arch-layer-name">{layer.name}</p>
            <div className="arch-nodes">
              {layer.nodes.map((node) => (
                <div key={node.title} className="arch-node">
                  <div className="arch-node-icons">
                    {node.tech.map((t) => (
                      <TechIcon key={t} name={t} size={16} />
                    ))}
                  </div>
                  <p className="arch-node-title">{node.title}</p>
                  <p className="arch-node-sub">{node.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {i < layers.length - 1 && (
            <div className="arch-flow">
              <span className="arch-line" aria-hidden="true" />
              <span className="arch-flow-label">
                <LuArrowDown aria-hidden="true" /> {flows[i]}
              </span>
              <span className="arch-line" aria-hidden="true" />
            </div>
          )}
        </Fragment>
      ))}
      <figcaption className="sr-only">
        {layers.map((l) => `${l.name}: ${l.nodes.map((n) => `${n.title} (${n.sub})`).join('; ')}`).join('. ')}
      </figcaption>
    </figure>
  );
}
