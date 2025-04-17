<?php

namespace Tests\Unit\Services;

use App\Models\User;
use App\Services\DataTableService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class DataTableServiceTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the DataTableService can be instantiated.
     */
    public function test_datatable_service_can_be_instantiated(): void
    {
        $request = new Request();
        $query = User::query();
        
        $dataTable = new DataTableService($query, $request);
        
        $this->assertInstanceOf(DataTableService::class, $dataTable);
    }
    
    /**
     * Test the DataTableService can process a query.
     */
    public function test_datatable_service_can_process_query(): void
    {
        // Create some test users
        User::factory()->count(5)->create();
        
        $request = new Request();
        $query = User::query();
        
        $dataTable = new DataTableService($query, $request);
        $result = $dataTable->process();
        
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('filters', $result);
        $this->assertEquals(5, $result['data']->total());
    }
    
    /**
     * Test the DataTableService can search.
     */
    public function test_datatable_service_can_search(): void
    {
        // Create test users with specific names
        User::factory()->create(['name' => 'John Doe']);
        User::factory()->create(['name' => 'Jane Smith']);
        
        // Create a request with search parameter
        $request = new Request(['search' => 'John']);
        $query = User::query();
        
        $dataTable = new DataTableService($query, $request);
        $dataTable->setSearchableFields(['name', 'email']);
        
        $result = $dataTable->process();
        
        $this->assertEquals(1, $result['data']->total());
        $this->assertEquals('John Doe', $result['data']->first()->name);
    }
    
    /**
     * Test the DataTableService can sort.
     */
    public function test_datatable_service_can_sort(): void
    {
        // Create test users with specific creation dates
        User::factory()->create([
            'name' => 'Older User',
            'created_at' => now()->subDays(2)
        ]);
        
        User::factory()->create([
            'name' => 'Newer User',
            'created_at' => now()->subDay()
        ]);
        
        // Test ascending sort
        $request = new Request([
            'sort_field' => 'created_at',
            'sort_direction' => 'asc'
        ]);
        
        $dataTable = new DataTableService(User::query(), $request);
        $result = $dataTable->process();
        
        $this->assertEquals('Older User', $result['data']->first()->name);
        
        // Test descending sort
        $request = new Request([
            'sort_field' => 'created_at',
            'sort_direction' => 'desc'
        ]);
        
        $dataTable = new DataTableService(User::query(), $request);
        $result = $dataTable->process();
        
        $this->assertEquals('Newer User', $result['data']->first()->name);
    }
    
    /**
     * Test the DataTableService can paginate.
     */
    public function test_datatable_service_can_paginate(): void
    {
        // Create 15 test users
        User::factory()->count(15)->create();
        
        // Test with 10 per page (default)
        $request = new Request();
        $dataTable = new DataTableService(User::query(), $request);
        $result = $dataTable->process();
        
        $this->assertEquals(10, $result['data']->perPage());
        $this->assertEquals(15, $result['data']->total());
        $this->assertEquals(2, $result['data']->lastPage());
        
        // Test with 5 per page
        $request = new Request(['per_page' => 5]);
        $dataTable = new DataTableService(User::query(), $request);
        $result = $dataTable->process();
        
        $this->assertEquals(5, $result['data']->perPage());
        $this->assertEquals(15, $result['data']->total());
        $this->assertEquals(3, $result['data']->lastPage());
    }
    
    /**
     * Test the helper function.
     */
    public function test_datatable_helper_function(): void
    {
        $this->assertTrue(function_exists('datatable'));
        
        $dataTable = datatable(User::query());
        
        $this->assertInstanceOf(DataTableService::class, $dataTable);
    }
}
