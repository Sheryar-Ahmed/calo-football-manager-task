import ReactPaginate from 'react-paginate';

interface Props {
  pageCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pageCount, currentPage, onPageChange }: Props) => {
  return (
    <ReactPaginate
      pageCount={pageCount}
      forcePage={currentPage - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName="flex items-center justify-center gap-2 mt-8 flex-wrap"
      pageClassName="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-[#f0fdf4] hover:text-[#3cad68] transition-colors cursor-pointer"
      activeClassName="bg-[#3cad68] text-white border-transparent"
      previousClassName="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-[#f0fdf4] hover:text-[#3cad68] transition-colors cursor-pointer"
      nextClassName="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-[#f0fdf4] hover:text-[#3cad68] transition-colors cursor-pointer"
      breakClassName="px-4 py-2 border rounded-lg text-sm text-gray-500"
      disabledClassName="opacity-40 cursor-not-allowed"
      previousLabel="«"
      nextLabel="»"
    />
  );
};
