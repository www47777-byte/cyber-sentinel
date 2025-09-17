import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';
import './Table.css';

const Table = ({
    data = [],
    columns = [],
    sortable = true,
    filterable = false,
    searchable = false,
    pagination = false,
    pageSize = 10,
    variant = 'default', // default, striped, bordered, compact, cyber
    hoverable = true,
    loading = false,
    empty = '데이터가 없습니다',
    className = '',
    onRowClick,
    ...props
}) => {
    const [sortField, setSortField] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({});

    // 정렬 처리
    const handleSort = (field) => {
        if (!sortable) return;
        
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // 데이터 필터링 및 정렬
    const processedData = useMemo(() => {
        let result = [...data];

        // 검색 필터링
        if (searchable && searchTerm) {
            result = result.filter(row =>
                columns.some(col => {
                    const value = row[col.key];
                    return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
                })
            );
        }

        // 컬럼 필터링
        if (filterable) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    result = result.filter(row => row[key] === value);
                }
            });
        }

        // 정렬
        if (sortField) {
            result.sort((a, b) => {
                const aVal = a[sortField];
                const bVal = b[sortField];
                
                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, filters, sortField, sortDirection, columns, searchable, filterable]);

    // 페이지네이션
    const paginatedData = useMemo(() => {
        if (!pagination) return processedData;
        
        const startIndex = (currentPage - 1) * pageSize;
        return processedData.slice(startIndex, startIndex + pageSize);
    }, [processedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(processedData.length / pageSize);

    const tableClasses = [
        'cyber-table-container',
        `cyber-table--${variant}`,
        hoverable && 'cyber-table--hoverable',
        loading && 'cyber-table--loading',
        className
    ].filter(Boolean).join(' ');

    // 로딩 상태
    if (loading) {
        return (
            <div className={tableClasses}>
                <div className="cyber-table__loading">
                    <div className="cyber-table__loading-spinner"></div>
                    <span>데이터를 불러오는 중...</span>
                </div>
            </div>
        );
    }

    // 빈 상태
    if (!loading && processedData.length === 0) {
        return (
            <div className={tableClasses}>
                <div className="cyber-table__empty">
                    <div className="cyber-table__empty-icon">📊</div>
                    <p className="cyber-table__empty-text">{empty}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={tableClasses} {...props}>
            {/* 테이블 헤더 툴바 */}
            {(searchable || filterable) && (
                <div className="cyber-table__toolbar">
                    {searchable && (
                        <div className="cyber-table__search">
                            <Search size={16} className="cyber-table__search-icon" />
                            <input
                                type="text"
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="cyber-table__search-input"
                            />
                        </div>
                    )}
                    
                    {filterable && (
                        <div className="cyber-table__filters">
                            <Filter size={16} />
                            <span>필터</span>
                            {/* 필터 구현은 필요에 따라 확장 */}
                        </div>
                    )}
                </div>
            )}

            {/* 테이블 */}
            <div className="cyber-table__wrapper">
                <table className="cyber-table">
                    <thead className="cyber-table__head">
                        <tr className="cyber-table__row">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`cyber-table__header ${
                                        sortable && column.sortable !== false ? 'cyber-table__header--sortable' : ''
                                    } ${sortField === column.key ? 'cyber-table__header--sorted' : ''}`}
                                    onClick={() => handleSort(column.key)}
                                    style={{ width: column.width }}
                                >
                                    <div className="cyber-table__header-content">
                                        <span className="cyber-table__header-text">{column.title}</span>
                                        {sortable && column.sortable !== false && (
                                            <div className="cyber-table__sort-icons">
                                                <ChevronUp 
                                                    size={14} 
                                                    className={`cyber-table__sort-icon ${
                                                        sortField === column.key && sortDirection === 'asc' ? 'active' : ''
                                                    }`}
                                                />
                                                <ChevronDown 
                                                    size={14} 
                                                    className={`cyber-table__sort-icon ${
                                                        sortField === column.key && sortDirection === 'desc' ? 'active' : ''
                                                    }`}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="cyber-table__body">
                        {paginatedData.map((row, index) => (
                            <tr
                                key={row.id || index}
                                className="cyber-table__row cyber-table__row--body"
                                onClick={() => onRowClick?.(row, index)}
                            >
                                {columns.map((column) => (
                                    <td key={column.key} className="cyber-table__cell">
                                        {column.render 
                                            ? column.render(row[column.key], row, index)
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 페이지네이션 */}
            {pagination && totalPages > 1 && (
                <div className="cyber-table__pagination">
                    <div className="cyber-table__pagination-info">
                        총 {processedData.length}개 항목 중 {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, processedData.length)}
                    </div>
                    <div className="cyber-table__pagination-controls">
                        <button
                            className="cyber-table__pagination-btn"
                            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            if (
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        className={`cyber-table__pagination-btn ${
                                            currentPage === page ? 'active' : ''
                                        }`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 || 
                                page === currentPage + 2
                            ) {
                                return <span key={page} className="cyber-table__pagination-dots">...</span>;
                            }
                            return null;
                        })}
                        
                        <button
                            className="cyber-table__pagination-btn"
                            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;