interface CardProps {
  title: string;
  content: string;
}

const Card = ({ title, content }: CardProps) => (
  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg hover:shadow-2xl border border-gray-700/50 p-6 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 backdrop-blur-sm relative overflow-hidden group">
    {/* Subtle glow effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    {/* Content */}
    <div className="relative z-10">
      <h2 className="text-lg  font-semibold text-purple-400 mb-3 group-hover:text-purple-300 transition-colors duration-200">
        {title}
      </h2>
      <p className="text-3xl font-bold text-white leading-tight tracking-tight drop-shadow-sm">
        {content}
      </p>
    </div>

    {/* Decorative element */}
    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
  </div>
);

export default Card;
