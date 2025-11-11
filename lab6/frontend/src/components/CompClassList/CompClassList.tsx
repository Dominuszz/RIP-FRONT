import './CompClassList.css';
import CompClassCard from '../CompClassCard/CompClassCard';
import { type ComplexClass } from '../../modules/compclassapi.ts';

export default function CompClassList({ compclasses }: {compclasses: ComplexClass[]}) {
    return (
        <div className="card-container">
            {compclasses.map((compclass) => (
                <CompClassCard key = { compclass.compclass_id } complexclass = { compclass } />
            ))}
        </div>
    );
}